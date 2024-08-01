import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Typography, Grid } from '@mui/material';
import PropTypes from 'prop-types';

const colors = {
  'Conforme': '#82ca9d',
  'No conforme': '#ff4d4d',
  'Necesita mejora': '#ffcc00',
  'No aplica': '#00bcd4',
};

const EstadisticasChart = ({ estadisticas = {}, title }) => {
  // Asegúrate de que estadisticas es un objeto válido
  const data = Object.keys(estadisticas).map(key => ({
    name: key,
    value: estadisticas[key]
  }));

  return (
    <Grid item xs={12} md={6}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <ResponsiveContainer width="100%" height={500}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={120}
            fill="#8884d8"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(2)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[entry.name] || '#8884d8'} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Grid>
  );
};

EstadisticasChart.propTypes = {
  estadisticas: PropTypes.object,
  title: PropTypes.string.isRequired,
};

export default EstadisticasChart;
