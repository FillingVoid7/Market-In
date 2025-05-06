import React from "react";

const Blog = () => {
  const articles = [
    {
      title: "How to Use Our Platform Efficiently",
      description:
        "Tips and tricks to get the most out of our features and tools.",
      date: "October 20, 2024",
    },
    {
      title: "Top 10 Features for Small Businesses",
      description:
        "Explore the best features that can help your business grow.",
      date: "October 15, 2024",
    },
    {
      title: "Productivity Tips for Entrepreneurs",
      description: "Maximize your efficiency with these helpful strategies.",
      date: "October 10, 2024",
    },
  ];

  return (
    <section className="py-16 px-6 bg-gray-50 mt-8">
      <div className="container mx-auto max-w-3xl">
        <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          Blog
        </h2>
        <p className="text-gray-700 mb-8 text-center">
          Explore our latest articles and insights below.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {articles.map((article, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {article.title}
              </h3>
              <p className="text-gray-600 mb-4">{article.description}</p>
              <p className="text-gray-500 text-sm">{article.date}</p>
              <button className="mt-4 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors duration-300">
                Read More
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
