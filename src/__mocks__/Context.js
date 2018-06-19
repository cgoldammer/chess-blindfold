import React, { Component } from "react";

const EmptyProvider = ({ children }) => (
  <div>
    <div>
      {children}
   </div>
  </div>
);

const testDefaults = {value: 'testvalue', number: 2};

export const Cont = {
  Provider: EmptyProvider
, Consumer: ({children}) => children(testDefaults)
}

export const dummy = 7;
