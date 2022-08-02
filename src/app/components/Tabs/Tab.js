import React, { Component } from 'react';
import PropTypes from 'prop-types';
import style from './styles.scss';

class Tab extends Component {
	static propTypes = {
		activeTab: PropTypes.string.isRequired,
		label: PropTypes.string.isRequired,
		onClick: PropTypes.func.isRequired,
	};

	onClick = () => {
		const { label, onClick } = this.props;
		onClick(label);
	};

	render() {
		const {
			onClick,
			props: { activeTab, label },
		} = this;

		const isActive = activeTab === label;
		return (
			<li className={isActive ? style.tab__list__active : null} onClick={onClick}>
				<h5>{label}</h5>
				<div>
					<div />
					<div />
				</div>
			</li>
		);
	}
}

export default Tab;
