export default function SecurityCard({ icon, title, description }) {
  return (
    <div className="security-card p-6 mb-4 border border-[#D9D9D9] rounded-md">
      <div className="flex flex-col md:flex-row items-start">
        <div className="mr-8 mt-5 flex justify-center w-full md:w-fit mb-6">
          {icon}
        </div>
        <div className="w-full">
          <h3 className="text-xl font-semibold mb-2 text-center md:text-start">
            {title}
          </h3>
          <p className="text-gray-600 leading-relaxed text-center md:text-start">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
