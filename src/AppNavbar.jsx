import React, { Component } from "react";
import { Navbar } from "react-bootstrap";

export const appName = "Blindfold chess";

export class AppNavbar extends React.Component {
  constructor(props){
    super(props);
  }
  render = () => {
    return (
			<div style={{ marginBottom: 0 }}>
				<Navbar collapseOnSelect style={{ marginBottom: 0, borderRadius: 0 }}>
					<Navbar.Header>
						<Navbar.Brand>
							{appName}
						</Navbar.Brand>
					</Navbar.Header>
				</Navbar>
			</div>
    )
  }
}
