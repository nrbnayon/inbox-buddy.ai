"use client";
import * as React from "react";

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

export function KeywordSelector() {
  const [keywords, setKeywords] = React.useState([
    { id: 1, text: "meetings", checked: true },
    { id: 2, text: "subscriptions", checked: false },
    { id: 3, text: "interviews", checked: false },
  ]);
  const [newKeyword, setNewKeyword] = React.useState("");
  const [openAdd, setOpenAdd] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [keywordToDelete, setKeywordToDelete] = React.useState(null);

  const handleAddKeyword = (e) => {
    e.preventDefault();
    if (newKeyword.trim()) {
      setKeywords([
        ...keywords,
        {
          id: Date.now(),
          text: newKeyword.trim(),
          checked: false,
        },
      ]);
      setNewKeyword("");
      setOpenAdd(false);
    }
  };

  const handleDeleteKeyword = () => {
    if (keywordToDelete !== null) {
      setKeywords(keywords.filter((keyword) => keyword.id !== keywordToDelete));
      setKeywordToDelete(null);
      setOpenDelete(false);
    }
  };

  const handleToggleKeyword = (id) => {
    setKeywords(
      keywords.map((keyword) =>
        keyword.id === id ? { ...keyword, checked: !keyword.checked } : keyword
      )
    );
  };

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
        >
          Select Keywords
          <FaAngleDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel className="flex justify-between items-center">
          Keywords
          <button onClick={() => setOpenAdd(true)} className="cursor-pointer">
            <GoPlus size={18} />
          </button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
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
            >
              {keyword.text}
            </DropdownMenuCheckboxItem>
            <button
              onClick={(e) => {
                e.stopPropagation();
                confirmDelete(keyword.id);
              }}
              className="text-red-500 hover:text-red-700 flex-shrink-0 cursor-pointer"
            >
              <FaRegTrashCan size={14} />
            </button>
          </div>
        ))}
      </DropdownMenuContent>

      {/* Add Keyword Dialog */}
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
            />
            <Button type="submit" className="w-full">
              Add Keyword
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
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
            <Button variant="outline" onClick={() => setOpenDelete(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteKeyword}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DropdownMenu>
  );
}
