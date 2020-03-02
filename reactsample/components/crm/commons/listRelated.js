import React from "react";

import './list-related.scss';

function ListRelated(props) {
  const { title, headers, data } = props;

  return (
    <div className={'container-list-related'}>
      <h3>{title}</h3>
      {data.length ? (
        <table>
          <thead>
          <tr>
            <th>S.No.</th>
            {headers.map(header => (
              <th key={header.key}>{header.title}</th>
            ))}
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          {data.map((datum, index) => (
            <tr key={index}>
              <td>{index}</td>
              {headers.map(header => (
                <td key={header.key}>{datum[header.key]}</td>
              ))}
              <td>
                <button className={'btn btn-outline-primary ml-2'}>Edit</button>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      ) : (
        <p>No records found!</p>
      )}
    </div>
  );
}

export default ListRelated;
