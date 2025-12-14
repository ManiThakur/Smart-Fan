
const API_BASE_URL = process.env.NEXT_PUBLIC_ATOMBERG_API_URL || 'https://api.atomberg-iot.com';

/**
 * Get access token using API key and refresh token
 */
export async function getAccessToken(apiKey: string, refreshToken: string): Promise<{ access_token: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: apiKey,
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Authentication failed: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    if (error.message) {
      throw error;
    }
    throw new Error('Failed to authenticate. Please check your credentials and network connection.');
  }
}

/**
 * Get list of devices (fans) for the authenticated user
 */
export async function getDevices(accessToken: string): Promise<any[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/devices`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        const error: any = new Error('Unauthorized. Token may have expired.');
        error.status = 401;
        throw error;
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch devices: ${response.status}`);
    }

    const data = await response.json();
  
    if (Array.isArray(data)) {
      return data;
    } else if (data.devices && Array.isArray(data.devices)) {
      return data.devices;
    } else if (data.data && Array.isArray(data.data)) {
      return data.data;
    }
    return [];
  } catch (error: any) {
    if (error.status) {
      throw error;
    }
    throw new Error('Failed to fetch devices. Please try again.');
  }
}

/**
 * Control a device (fan)
 */
export async function controlDevice(
  accessToken: string,
  deviceId: string,
  command: {
    power?: boolean;
    speed?: number;
    mode?: string;
    [key: string]: any;
  }
): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/devices/${deviceId}/control`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(command),
    });

    if (!response.ok) {
      if (response.status === 401) {
        const error: any = new Error('Unauthorized. Token may have expired.');
        error.status = 401;
        throw error;
      }
      if (response.status === 404) {
        throw new Error('Device not found or not accessible.');
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to control device: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    if (error.status) {
      throw error;
    }
    throw new Error('Failed to control device. Please try again.');
  }
}

/**
 * Get device status
 */
export async function getDeviceStatus(accessToken: string, deviceId: string): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/devices/${deviceId}/status`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        const error: any = new Error('Unauthorized. Token may have expired.');
        error.status = 401;
        throw error;
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch device status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    if (error.status) {
      throw error;
    }
    throw new Error('Failed to fetch device status. Please try again.');
  }
}
