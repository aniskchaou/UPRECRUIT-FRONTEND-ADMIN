import React from 'react';
import PropTypes from 'prop-types';
import './Configuration.css';

const Configuration = () => (
  <div className="card">
    <div className="card-header">
      <strong className="card-title">Configuration</strong>
    </div>
    <div className="card-body">

      <ul class="nav nav-tabs mb-3" id="ex1" role="tablist">
        <li class="nav-item" role="presentation">
          <a
            class="nav-link active"
            id="ex1-tab-1"
            data-mdb-toggle="tab"
            href="#ex1-tabs-1"
            role="tab"
            aria-controls="ex1-tabs-1"
            aria-selected="true"
          >Tab 1</a
          >
        </li>
        <li class="nav-item" role="presentation">
          <a
            class="nav-link"
            id="ex1-tab-2"
            data-mdb-toggle="tab"
            href="#ex1-tabs-2"
            role="tab"
            aria-controls="ex1-tabs-2"
            aria-selected="false"
          >Tab 2</a
          >
        </li>
        <li class="nav-item" role="presentation">
          <a
            class="nav-link"
            id="ex1-tab-3"
            data-mdb-toggle="tab"
            href="#ex1-tabs-3"
            role="tab"
            aria-controls="ex1-tabs-3"
            aria-selected="false"
          >Tab 3</a
          >
        </li>
      </ul>


      <div class="tab-content" id="ex1-content">
        <div
          class="tab-pane fade show active"
          id="ex1-tabs-1"
          role="tabpanel"
          aria-labelledby="ex1-tab-1"
        >
          Tab 1 content
  </div>
        <div class="tab-pane fade" id="ex1-tabs-2" role="tabpanel" aria-labelledby="ex1-tab-2">
          Tab 2 content
  </div>
        <div class="tab-pane fade" id="ex1-tabs-3" role="tabpanel" aria-labelledby="ex1-tab-3">
          Tab 3 content
  </div>
      </div>












    </div>
  </div>
);

Configuration.propTypes = {};

Configuration.defaultProps = {};

export default Configuration;
