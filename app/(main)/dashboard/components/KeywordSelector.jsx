"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FaAngleDown } from "react-icons/fa";
import { GoPlus } from "react-icons/go";
import { FaRegTrashCan } from "react-icons/fa6";
import { toast } from "sonner";
import {
  getUserKeywords,
  addUserKeyword,
  deleteUserKeyword,
} from "@/lib/api/keyword";
import { useEffect, useState } from "react";

export function KeywordSelector({ onKeywordChange }) {
  const [keywords, setKeywords] = useState([]);
  const [newKeyword, setNewKeyword] = useState("");
  const [openAdd, setOpenAdd] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [keywordToDelete, setKeywordToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch keywords on mount
  useEffect(() => {
    const fetchKeywords = async () => {
      setIsLoading(true);
      try {
        const response = await getUserKeywords();
        // Transform API response (string[]) to local state format
        const fetchedKeywords = response.keywords.map((text, index) => ({
          id: `kw-${index}-${Date.now()}`, // Unique ID for local state
          text,
          checked: false,
        }));
        setKeywords(fetchedKeywords);
        setError(null);
      } catch (err) {
        setError(err.message);
        toast.error(err.message, {
          description: "Failed to fetch keywords",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchKeywords();
  }, []);

  // Notify parent of selected keywords
  useEffect(() => {
    const selectedKeywords = keywords
      .filter((keyword) => keyword.checked)
      .map((keyword) => keyword.text);
    if (onKeywordChange) {
      onKeywordChange(selectedKeywords);
    }
  }, [keywords, onKeywordChange]);

  // Add a new keyword
  const handleAddKeyword = async (e) => {
    e.preventDefault();
    if (!newKeyword.trim()) {
      toast.error("Keyword cannot be empty");
      return;
    }
    setIsLoading(true);
    try {
      const response = await addUserKeyword(newKeyword.trim());
      setKeywords([
        ...keywords,
        {
          id: `kw-${keywords.length}-${Date.now()}`,
          text: newKeyword.trim(),
          checked: false,
        },
      ]);
      setNewKeyword("");
      setOpenAdd(false);
      toast.success("Keyword added successfully");
    } catch (err) {
      toast.error(err.message, {
        description: "Failed to add keyword",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a keyword
  const handleDeleteKeyword = async () => {
    if (keywordToDelete === null) return;
    const keyword = keywords.find((k) => k.id === keywordToDelete);
    if (!keyword) return;
    setIsLoading(true);
    try {
      await deleteUserKeyword(keyword.text);
      setKeywords(keywords.filter((k) => k.id !== keywordToDelete));
      setKeywordToDelete(null);
      setOpenDelete(false);
      toast.success("Keyword deleted successfully");
    } catch (err) {
      toast.error(err.message, {
        description: "Failed to delete keyword",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle keyword selection
  const handleToggleKeyword = (id) => {
    setKeywords(
      keywords.map((keyword) =>
        keyword.id === id ? { ...keyword, checked: !keyword.checked } : keyword
      )
    );
  };

  // Open delete confirmation dialog
  const confirmDelete = (id) => {
    setKeywordToDelete(id);
    setOpenDelete(true);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="ring-0 focus-within:ring-0 focus-visible:ring-0 cursor-pointer"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Select Keywords"}
          <FaAngleDown className="ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel className="flex justify-between items-center">
          Keywords
          <button
            onClick={() => setOpenAdd(true)}
            className="cursor-pointer"
            disabled={isLoading}
          >
            <GoPlus size={18} />
          </button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {keywords.length === 0 && !isLoading && (
          <div className="px-2 py-1.5 text-sm text-gray-500">
            No keywords available
          </div>
        )}
        <div
          className="max-h-[200px] overflow-y-auto"
          style={{ maxHeight: keywords.length > 5 ? "200px" : "auto" }}
        >
          {keywords.map((keyword) => (
            <div
              key={keyword.id}
              className="flex items-center justify-between px-2 py-1.5"
            >
              <DropdownMenuCheckboxItem
                checked={keyword.checked}
                onCheckedChange={() => handleToggleKeyword(keyword.id)}
                onSelect={(e) => e.preventDefault()}
                className="w-full mr-2"
                disabled={isLoading}
              >
                {keyword.text}
              </DropdownMenuCheckboxItem>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  confirmDelete(keyword.id);
                }}
                className="text-red-500 hover:text-red-700 flex-shrink-0 cursor-pointer"
                disabled={isLoading}
              >
                <FaRegTrashCan size={14} />
              </button>
            </div>
          ))}
        </div>
      </DropdownMenuContent>

      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Keyword</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddKeyword} className="space-y-4">
            <Input
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              placeholder="Enter new keyword"
              className="w-full"
              disabled={isLoading}
            />
            <Button
              type="submit"
              className="w-full link-btn"
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add Keyword"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to delete the keyword "
              {keywords.find((k) => k.id === keywordToDelete)?.text || ""}"?
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenDelete(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteKeyword}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DropdownMenu>
  );
}
