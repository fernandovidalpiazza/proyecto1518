
import { FormControl, InputLabel, MenuItem, Select, Box } from "@mui/material";

const SelectorFormulario = ({ formularios, formularioSeleccionadoId, handleSeleccionarFormulario }) => {
  return (
    <Box mb={4}>
      <FormControl fullWidth>
        <InputLabel id="select-formulario-label">Seleccionar formulario</InputLabel>
        <Select
          labelId="select-formulario-label"
          id="select-formulario"
          value={formularioSeleccionadoId}
          label="Seleccionar formulario"
          onChange={handleSeleccionarFormulario}
        >
          <MenuItem value="">
            <em>Seleccione un formulario</em>
          </MenuItem>
          {formularios.map((formulario) => (
            <MenuItem key={formulario.id} value={formulario.id}>
              {formulario.nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default SelectorFormulario;

