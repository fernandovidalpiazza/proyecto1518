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
        id: "products",
        path: "/shop",
        title: "Auditoria",
        Icon: ChecklistIcon
    },
    {
        id: "cart",
        path: "/cart",
        title: "Formularios",
        Icon: FormatListBulletedOutlinedIcon
    },
    {
        id: "editar",
        path: "/editar",
        title: "EditarFormulario",
        Icon: FormatListBulletedOutlinedIcon
    },
    {
        id: "Establecimiento ",
        path: "/establecimiento",
        title: "Establecimientos",
        Icon: BusinessIcon
    },
    {
        id: "sucursal ",
        path: "/sucursales",
        title: "Sucursal",
        Icon: BusinessIcon
    },

    {
        id: "Reporte",
        path: "/Reporte",
        title: "Rerporte",
        Icon: PictureAsPdfIcon
    },
    {
        id: "User",
        path: "/User",
        title: "User",
        Icon: BadgeOutlinedIcon
    },

    
]