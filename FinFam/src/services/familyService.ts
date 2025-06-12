import { api } from '../utils/api';
import { z } from 'zod';

// Esquema de validação para família
export const familySchema = z.object({
  id: z.number(),
  name: z.string().min(1, 'Nome da família é obrigatório'),
  adminId: z.number()
});

// Esquema para criação de família
export const createFamilySchema = z.object({
  name: z.string().min(1, 'Nome da família é obrigatório')
});

// Esquema para atualização de família
export const updateFamilySchema = createFamilySchema;

// Esquema para adição de membro à família
export const addMemberSchema = z.object({
  familyId: z.number(),
  email: z.string().email('Email inválido')
});

// Tipos inferidos dos esquemas
export type Family = z.infer<typeof familySchema>;
export type CreateFamilyData = z.infer<typeof createFamilySchema>;
export type UpdateFamilyData = z.infer<typeof updateFamilySchema>;
export type AddMemberData = z.infer<typeof addMemberSchema>;

// Classe de serviço de família
class FamilyService {
  // Método para listar todas as famílias do usuário
  async listFamilies(): Promise<Family[]> {
    const response = await api.get<Family[]>('/families');
    return response.data;
  }

  // Método para obter detalhes de uma família específica
  async getFamily(id: number): Promise<Family> {
    const response = await api.get<Family>(`/families/${id}`);
    return response.data;
  }

  // Método para criar uma nova família
  async createFamily(data: CreateFamilyData): Promise<Family> {
    const response = await api.post<Family>('/families', data);
    return response.data;
  }

  // Método para atualizar uma família existente
  async updateFamily(id: number, data: UpdateFamilyData): Promise<Family> {
    const response = await api.put<Family>(`/families/${id}`, data);
    return response.data;
  }

  // Método para adicionar um membro à família
  async addMember(data: AddMemberData): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/families/members', data);
    return response.data;
  }
}

// Exporta uma instância única do serviço
export const familyService = new FamilyService();