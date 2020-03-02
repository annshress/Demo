import React from "react";

import "./style.scss";

export default function TableNavigation({
  pagination,
  selectPage,
  selectPageSize,
  onPageChange
}) {
  // onPageChange should accept (page, pageSize) arguments

  const { current, last, total, pageSize } = pagination;

  selectPage =
    selectPage ||
    function(page) {
      onPageChange(page);
    };

////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////

                </li>
                <li>
                  <button
                    onClick={() => selectPage(last)}
                    title=""
                    disabled={last === current}
                    className={"btn btn-outline-primary btn-pagination"}
                  >
                    {"Last"}
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
        <div className="col-4">
          <div className="table_row_number size-pagination">
            {total > 10 ? (
              <React.Fragment>
                <span> show </span>
                <select
                  value={pageSize}
                  onChange={e => selectPageSize(e.target.value)}
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="30">30</option>
                  <option value="40">40</option>
                </select>
                <span>
                  of <b>{total}</b> total
                </span>
              </React.Fragment>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div />
  );
}
