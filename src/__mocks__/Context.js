import React from "react";
import PropTypes from "prop-types";

const EmptyProvider = ({ children }) => (
  <div>
    <div>{children}</div>
  </div>
);

EmptyProvider.propTypes = {
  children: PropTypes.any,
};

const testDefaults = { value: "testvalue", number: 2 };

export const Cont = {
  Provider: EmptyProvider,
  Consumer: ({ children }) => children(testDefaults),
};

export const dummy = 7;
