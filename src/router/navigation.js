import HomeIcon from '@mui/icons-material/Home';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ChecklistIcon from '@mui/icons-material/Checklist';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import BusinessIcon from '@mui/icons-material/Business';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';

export const menuItems = [
    {
        id: "home",
        path: "/",
        title: "Inicio",
        Icon: HomeIcon
    },
    {
        id: "auditoria",
        path: "/shop",
        title: "Auditoría",
        Icon: ChecklistIcon
    },
    {
        id: "formularios",
        path: "/cart",
        title: "Formularios",
        Icon: FormatListBulletedOutlinedIcon
    },
    {
        id: "editar-formulario",
        path: "/editar-formulario",
        title: "Editar Formulario",
        Icon: FormatListBulletedOutlinedIcon
    },
    {
        id: "establecimiento",
        path: "/establecimiento",
        title: "Establecimientos",
        Icon: BusinessIcon
    },
    {
        id: "sucursal",
        path: "/sucursales",
        title: "Sucursales",
        Icon: BusinessIcon
    },
    {
        id: "reporte",
        path: "/reporte",
        title: "Reporte",
        Icon: PictureAsPdfIcon
    },
    {
        id: "usuarios",
        path: "/user",
        title: "Usuarios",
        Icon: BadgeOutlinedIcon
    }
];
