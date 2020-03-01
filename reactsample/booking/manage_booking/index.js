import React, { Component } from "react";

import './style.scss';

import Header from "../../../layouts/header";
import PageTitle from "../../../layouts/page_title";
import Content from "../../../layouts/content";
import ListTable from "../../../../commons/utils/ListTable";

import FilterRow from "./FilterRow";
import NavBarAppointmentBooking from "../../NavBarAppointmentBooking";
import TableNavigation from "../../../../commons/utils/TableNavigation";
import {
  handleBookingList,
  handleDeleteBooking
} from "../../../../remote_access/appointment/bookings";
import TopHeader from "../../../layouts/top_header";
import SideNav from "../../../layouts/SideNav";

class ManageBooking extends Component {
  company_id = this.props.match.params.company;

  state = {
    selectedBooking: [],
    headers: [
      { title: "", width: "10", type: "checkbox" },
      {
        title: "Services",
        width: "25",
        expression: obj => {
          return obj.services.map(each => [
            `${each.service__name},
            ${each.booked_date} ${each.start_time}`
          ]);
        }
      },
      {
        title: "Customer Details",
        width: "25",
        expression: obj => {
          return [obj.client.name, obj.client.contact, obj.client.email];
        }
      },
      { title: "Total", width: "10", key: "total" },
      { title: "Status", width: "10", key: "status" },
      { title: "", width: "20", type: "edit-delete" }
    ],
    results: [],
    pagination: {
      current: 1,
      total: 0,
      pageSize: 10,
      last: 1
    },
    urlParams: {}
  };

  setUrlParams = params => {
    this.setState(state => {
      return { ...state, urlParams: params };
    });
  };

  getBookings = async (page, pageSize) => {
    pageSize = pageSize || this.state.pagination.pageSize;
    const result = await handleBookingList({
      company_id: this.company_id,
      pageSize: pageSize || this.state.pagination.pageSize,
      page: page || this.state.pagination.current,
      ...this.state.urlParams
    });
    // console.log(result.result.results);
    if (result.ok & this.mounted) {
      this.setState(state => {
        return {
          ...state,
          results: result.result.results,
          pagination: {
            ...state.pagination,
            current: page || 1,
            pageSize: pageSize,
            total: result.result.count,
            last: Math.ceil(result.result.count / pageSize)
          }
        };
      });
    }
  };

  componentDidMount = () => {
    this.mounted = true;

    this.getBookings();
  };

  componentWillUnmount() {
    this.mounted = false;
  }

  // formatData = data => {
  //   const results = data.map(datum => ({
  //     id: datum.id,
  //     service: {
  //       name: datum.service,
  //       date: datum.booked_date,
  //       time: datum.booked_time
  //     },
  //     client: {
  //       name: datum.client.name,
  //       email: datum.client.email,
  //       contact: datum.client.contact
  //     },
  //     total: datum.total,
  //     status: this.getStatusDisplay(datum.status)
  //   }));
  // };

  selectBooking = key => {
    let selectedBooking = [];
    if (isNaN(key)) {
      selectedBooking = this.state.selectedBooking.concat(key);
    } else {
      selectedBooking = [...this.state.selectedBooking, key];
    }
    selectedBooking = new Set(selectedBooking);
    this.setState({
      ...this.state,
      selectedBooking: selectedBooking
    });
  };

  unselectBooking = key => {};

  getStatusDisplay = status => {
    return {
      0: "pending",
      1: "confirmed",
      2: "cancelled"
    }[status];
  };

  content = () => {};

  onSearch = async values => {
    // wait for setting the url params to complete
    await this.setUrlParams(values);
    this.getBookings();
  };

  deletionHandler = (e, instance_id) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm("Are you sure you want to delete?")) {
      return;
    }

    e.preventDefault();
    handleDeleteBooking({
      company_id: this.company_id,
      instance_id: instance_id
    });
    this.setState(state => {
      return {
        ...state,
        results: state.results.filter(each => each.id !== instance_id)
      };
    });
  };

  render() {
    return (
      <React.Fragment>
        <Header title="Manage Bookings | Appointment Scheduler"/>
        <TopHeader/>
        <div className={'container-fluid container-manage-booking'}>
          <div className={'row'}>
            <div className={'col-2 col-side-nav'}>
              <SideNav type={'appointment-scheduler'}/>
            </div>
            <div className={'col-10 col-main-content'}>
              <NavBarAppointmentBooking company_id={this.company_id}/>
              <PageTitle
                title="Manage Bookings"
                info="Below you can see a list of bookings who do the different service you offer.
                You can have one or multiple employees."
              />
              <Content>
                <FilterRow onSearch={this.onSearch} company_id={this.company_id} />
                <ListTable
                  headers={this.state.headers}
                  results={this.state.results}
                  deletionHandler={this.deletionHandler}
                  // eslint-disable-next-line no-template-curly-in-string
                  editLink={"/" + this.company_id + "/appointment/edit-booking/${id}"}
                />
                <TableNavigation
                  pagination={this.state.pagination}
                  onPageChange={this.getBookings}
                />
              </Content>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ManageBooking;
