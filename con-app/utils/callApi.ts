import { Post } from "@sm/common";

interface TokenResponse {
  token: string;
  channelName: string;
  //   userId: number;
}

interface TokenRequest {
  channelName: string;
  userId?: number;
}

export class CallApi {
  private baseUrl: string;

  constructor(baseUrl: string = "https://your-api-domain.com") {
    this.baseUrl = baseUrl;
  }

  async getAgoraToken(request: TokenRequest): Promise<TokenResponse> {
    try {
      const response = await Post("agora/token", {
        channelName: request.channelName,
        userId: request.userId,
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch Agora token:", error);
      throw error;
    }
  }

  async endCall(appointmentId: string): Promise<void> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/calls/${appointmentId}/end`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Add your auth headers here
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to end call:", error);
      // Don't throw here, as the call should end locally even if API fails
    }
  }

  async updateCallStatus(
    appointmentId: string,
    status: "started" | "ended"
  ): Promise<void> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/calls/${appointmentId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to update call status:", error);
    }
  }
}

// Singleton instance
export const callApi = new CallApi();
