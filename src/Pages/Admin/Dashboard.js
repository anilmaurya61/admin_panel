import { colors } from '@material-ui/core';
import React from 'react';

const Dashboard = () => {
  const styles = {
    dashboard: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    card: {
      padding: '10px',
      width: '300px',
      textAlign: 'center',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    },
    cardHeading: {
      marginBottom: '10px',
    },
    cardParagraph: {
      marginBottom: '5px',
    },
  };

  const { dashboard, card, cardHeading, cardParagraph } = styles;

  return (
    <div>
      <h1>Dashboard</h1>
      <div style={dashboard}>
        <div style={card}>
          <h3 style={cardHeading}>Sales</h3>
          <p>2.382</p>
          <p style={cardParagraph}>-3.65% Since last week</p>
        </div>
        <div style={card}>
          <h3 style={cardHeading}>Visitors</h3>
          <p>14.212</p>
          <p style={cardParagraph}>5.25% Since last week</p>
        </div>
        <div style={card}>
          <h3 style={cardHeading}>Earnings</h3>
          <p>$21.300</p>
          <p style={cardParagraph}>6.65% Since last week</p>
        </div>
        <div style={card}>
          <h3 style={cardHeading}>Orders</h3>
          <p>64</p>
          <p style={cardParagraph}>-2.25% Since last week</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
