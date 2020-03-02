import React from "react";

import "./style.scss";
import Categories from "./categories";
import Solutions from "./solutions";

import {
  handleFetchCategories,
  handleFetchSolutions,
  handleFetchCompanyActivatedApps,
  handleActivateApplication
} from "../../../remote_access/business/applications";

import "../../../assets/css/business_applications.css";
import Header from "../../layouts/header";
import TopHeader from "../../layouts/top_header";
import SideNav from "../../layouts/SideNav";
import NavBarBusinessAccount from "../../accounts/business_account/navbarBusinessAccount";

const PAGESIZE = 1000;

function Applications(props) {
  const { company } = props.match.params;

  const [state, setState] = React.useState({
    categories: [],
    solutions: [],
    activatedApps: [],
    selectedCategory: null,
    page: 1,
    totalPages: 1
  });

  // get categories
  React.useEffect(() => {
    const getCategories = async () => {
      const response = await handleFetchCategories({
        company_id: company
      });
      if (response.ok) {
        setState(old => {
          return {
            ...old,
            categories: response.result
          };
        });
      }
    };
    getCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // get solutions, apply category filters
  const getSolutions = async inc => {
    let params = {};
    if (state.selectedCategory) {
      params = { categories: state.selectedCategory };
    }
    // page state update is not reflected immediately, so hard coding it
    const page = inc ? state.page + 1 : state.page;
    const response = await handleFetchSolutions({
      company_id: company,
      pageSize: PAGESIZE,
      page: page,
      ...params
    });
    return response;
  };

  // store solutions into state INITIALLY
  React.useEffect(() => {
    const temp = async () => {
      const response = await getSolutions();
      if (response.ok) {
        setState(old => {
          return {
            ...old,
            solutions: response.result.results,
            totalPages: response.result.count / PAGESIZE
          };
        });
      }
    };
    temp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.selectedCategory]);

  // get company activated apps
  React.useEffect(() => {
    const getActivatedApps = async () => {
      const response = await handleFetchCompanyActivatedApps({
        company_id: company
      });
      if (response.ok) {
        setState(old => {
          return {
            ...old,
            activatedApps: response.result
          };
        });
      }
    };
    getActivatedApps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // activation - deactivation api calling
  const activateApp = async (appName, appId) => {
    const data = { app_name: appName };
    const response = await handleActivateApplication({
      company_id: company,
      data: data
    });
    if (response.ok) {
      if (state.activatedApps.indexOf(appId) >= 0) {
        setState(old => {
          return {
            ...old,
            activatedApps: old.activatedApps.filter(each => each !== appId)
          };
        });
      } else {
        setState(old => {
          let temp = old.activatedApps;
          temp.push(appId);
          return {
            ...old,
            activatedApps: temp
          };
        });
      }
    } else {
      console.log(response);
    }
  };

  // category on click handler
  const filterByCategory = async category => {
    setState(old => {
      return {
        ...old,
        selectedCategory: category,
        // reset the page
        page: 1
      };
    });
  };

  // load more button handler
  const handleLoadMore = async () => {
    setState(old => {
      return {
        ...old,
        page: old.page + 1
      };
    });
    const temp = async () => {
      const response = await getSolutions(true);
      if (response.ok) {
        setState(old => {
          return {
            ...old,
            solutions: [...old.solutions, ...response.result.results]
          };
        });
      }
    };
    temp();
  };

  return (
    <React.Fragment>
      <Header title="Dashboard | Business Application"/>
      <TopHeader/>
      <div className={'container-fluid container-business-application'}>
        <div className={'row'}>
          <div className={'col-2 col-side-nav'}>
            <SideNav type={'business-application'} company={company}/>
          </div>
          <div className={'col-10 col-main-content'}>
            <NavBarBusinessAccount company_id={company}/>
            <div className={'container main-content'}>
              <div className="row">
                <div className="col-9">
                  <Solutions
                    solutions={state.solutions}
                    activatedSolutions={state.activatedApps}
                    solutionClickHandler={activateApp}
                    loadMore={handleLoadMore}
                    company_id={company}
                  />
                </div>
                <div className="col-3">
                  <Categories
                    categories={state.categories}
                    selectedCategory={state.selectedCategory}
                    filterByCategory={filterByCategory}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Applications;
