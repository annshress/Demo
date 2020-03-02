import React from "react";
import PropTypes from "prop-types";
import IosStar from "react-ionicons/lib/IosStar";

function Categories(props) {
  const { categories, selectedCategory, filterByCategory } = props;

  return (
    <React.Fragment>
      <div className="row row-top-cat-header">
        <div className="col-12">
          <h3>Top Categories</h3>
        </div>
      </div>
      <div className="row row-top-category justify-content-center">
        <div className="col-12">
          <IosStar className={selectedCategory === null && "icon-fav"} />
          <span onClick={() => filterByCategory(null)}>All Apps</span>
        </div>
      </div>
      {categories.map(cat => (
        <div
          className="row row-top-category justify-content-center"
          key={cat.id}
          onClick={() => filterByCategory(cat.id)}
        >
          <div className="col-12">
            <IosStar className={selectedCategory === cat.id && "icon-fav"} />
            <span>{cat.name}</span>
          </div>
        </div>
      ))}
    </React.Fragment>
  );
}

Categories.propTypes = {
  categories: PropTypes.array.isRequired
};

export default Categories;
