import React from "react";
import PropTypes from "prop-types";
import SolutionCard from "./solutionCard";
import Divider from "../../../commons/divider";

function Solutions(props) {
  const {
    solutions,
    activatedSolutions,
    solutionClickHandler,
    company_id
  } = props;

  const [filteredSolutions, setState] = React.useState([]);

  React.useEffect(() => {
    setState(solutions);
  }, [solutions])

  const filterSolutions = (value) => {
    setState(solutions.filter(x => x.display_name.toLowerCase().indexOf(value.toLowerCase()) >= 0));
  }

  return (
    <React.Fragment>
      <div className="row">
        <div className="col-12 search-box">
          <input
            type="text"
            className="search_field"
            placeholder="Search for Applications"
            onChange={(e) => {filterSolutions(e.target.value)}}
          />
        </div>
      </div>
      <div className="row">
        <Divider type="blank" />
      </div>
      <div className="row">
        <div className="col-12">
          <h3>Featured Solutions</h3>
        </div>
      </div>
        {filteredSolutions.map(solution => {
          const isActivated = activatedSolutions.indexOf(solution.id) >= 0;

          return (
            <SolutionCard
              key={solution.id}
              solution={solution}
              isActivated={isActivated}
              company_id={company_id}
              solutionClickHandler={solutionClickHandler}
            />
          );
        })}
    </React.Fragment>
  );
}

Solutions.propTypes = {
  solutions: PropTypes.array.isRequired,
  activatedSolutions: PropTypes.array.isRequired,
  solutionClickHandler: PropTypes.func.isRequired,
  company_id: PropTypes.string.isRequired
};

export default Solutions;
