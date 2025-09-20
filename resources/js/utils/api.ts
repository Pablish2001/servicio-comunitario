import axios from 'axios';

export async function validarCredenciales(cedula: string, password: string) {
    try {
        const response = await axios.post('/jornada/validar-credenciales', { cedula, password });
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        return { success: false, message: 'Error de conexión' };
    }
}
