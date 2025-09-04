'use client';

interface WorksFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function WorksFilter({ 
  categories, 
  selectedCategory, 
  onCategoryChange 
}: WorksFilterProps) {
  return (
    <section className="py-8 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`
                relative px-6 py-3 text-sm font-medium rounded-full transition-all duration-300
                ${selectedCategory === category
                  ? 'text-red-600 bg-red-50 border border-red-200 shadow-sm'
                  : 'text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                }
                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50
              `}
            >
              {category}
              {selectedCategory === category && (
                <div className="absolute inset-0 rounded-full bg-red-600 opacity-5" />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}