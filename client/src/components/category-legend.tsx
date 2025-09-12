import { type Category } from "@shared/schema";

const categories: { name: Category; color: string }[] = [
  { name: "Analytics", color: "#8B5CF6" },
  { name: "Compute", color: "#06B6D4" },
  { name: "Database", color: "#EF4444" },
  { name: "Machine Learning", color: "#10B981" },
  { name: "Storage", color: "#F59E0B" },
  { name: "Security", color: "#EC4899" },
  { name: "Networking", color: "#8B5CF6" },
  { name: "Developer Tools", color: "#06B6D4" },
  { name: "Microservices", color: "#A855F7" },
];

export function CategoryLegend() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
        Category Legend
      </h3>
      <div className="flex flex-wrap gap-4">
        {categories.map((category) => (
          <div key={category.name} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: category.color }}
            />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {category.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
