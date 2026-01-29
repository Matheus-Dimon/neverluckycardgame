// frontend/src/config/api.js
// Configuração centralizada de API para o NeverLucky Card Game

// Detectar ambiente automaticamente
const isDevelopment = import.meta.env.DEV || window.location.hostname === 'localhost';

// IMPORTANTE: Substitua esta URL pela URL real do seu backend no Render
// Exemplo: https://neverlucky-backend.onrender.com
export const API_BASE_URL = isDevelopment 
  ? 'http://localhost:8080'  // Desenvolvimento local
  : import.meta.env.VITE_API_URL || 'https://neverlucky-backend.onrender.com'; // Produção

// Log para debug (apenas em desenvolvimento)
if (isDevelopment) {
  console.log('🌐 API Configuration:', {
    environment: 'Development',
    apiUrl: API_BASE_URL,
    hostname: window.location.hostname
  });
} else {
  console.log('🌐 API URL:', API_BASE_URL);
}

// Configuração padrão para todas as requisições
export const fetchConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // Importante para CORS com cookies
};

/**
 * Helper para fazer requisições à API
 * @param {string} endpoint - Endpoint da API (ex: '/api/auth/login')
 * @param {object} options - Opções do fetch (method, body, headers, etc)
 * @returns {Promise} - Promise com os dados da resposta
 */
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    ...fetchConfig,
    ...options,
    headers: {
      ...fetchConfig.headers,
      ...options.headers,
    },
  };

  // Log da requisição (apenas em desenvolvimento)
  if (isDevelopment) {
    console.log('📡 API Request:', {
      method: config.method || 'GET',
      url,
      hasBody: !!config.body,
      headers: config.headers,
    });
  }

  try {
    const response = await fetch(url, config);
    
    // Log da resposta (apenas em desenvolvimento)
    if (isDevelopment) {
      console.log('📥 API Response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        url: response.url,
      });
    }

    // Tratar erros HTTP
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        // Se não conseguir parsear JSON, usar o texto
        const errorText = await response.text();
        if (errorText) errorMessage = errorText;
      }

      console.error('❌ API Error:', {
        status: response.status,
        message: errorMessage,
        url: response.url,
      });

      throw new Error(errorMessage);
    }

    // Tentar parsear resposta JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    // Se não for JSON, retornar texto
    return await response.text();

  } catch (error) {
    console.error('❌ Request failed:', {
      message: error.message,
      url,
      method: config.method || 'GET',
    });
    throw error;
  }
}

/**
 * Helper para requisições com autenticação
 * Adiciona automaticamente o token JWT ao header
 */
export async function authenticatedRequest(endpoint, options = {}) {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    throw new Error('No authentication token found. Please login first.');
  }

  return apiRequest(endpoint, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    },
  });
}

/**
 * Verificar se o backend está acessível
 * @returns {Promise<boolean>}
 */
export async function checkBackendHealth() {
  try {
    const response = await apiRequest('/health');
    return response.status === 'UP';
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
}

// Exportar também para uso direto
export default {
  API_BASE_URL,
  apiRequest,
  authenticatedRequest,
  checkBackendHealth,
};
