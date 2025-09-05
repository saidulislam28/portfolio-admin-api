import React, { useState, useEffect } from 'react';
import { Button, Space, Card, Avatar, Typography, message } from 'antd';
import {
  AudioMutedOutlined,
  AudioOutlined,
  VideoCameraOutlined,
  VideoCameraAddOutlined,
  DisconnectOutlined,
  UserOutlined,
  CrownOutlined
} from '@ant-design/icons';
import {
  AgoraRTCProvider,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRTCClient,
  useRemoteAudioTracks,
  useRemoteUsers,
  RemoteUser,
  LocalVideoTrack,
} from 'agora-rtc-react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { AGORA_APP_ID } from '~/configs';

const { Text } = Typography;

// Inner component that uses the Agora hooks
const VideoCallRoom = ({ channelName, userId, token, onCallEnd, isAdmin = false }) => {
  const [isAudioMuted, setIsAudioMuted] = useState(true); // Start muted
  const [isVideoMuted, setIsVideoMuted] = useState(true); // Start with video off
  const [isJoined, setIsJoined] = useState(false);

  const agoraEngine = useRTCClient();
  const { isLoading: isJoining, isConnected } = useJoin({
    appid: AGORA_APP_ID,
    channel: channelName,
    token: token,
    uid: userId,
  });

  // Local tracks - start muted/disabled
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(true); // true = muted initially
  const { localCameraTrack } = useLocalCameraTrack(true); // true = disabled initially

  // Publish tracks
  usePublish([localMicrophoneTrack, localCameraTrack]);

  // Remote users and audio
  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);

  // Play remote audio tracks
  useEffect(() => {
    audioTracks.forEach((track) => track.play());
  }, [audioTracks]);

  // Handle connection status
  useEffect(() => {
    if (isConnected && !isJoined) {
      setIsJoined(true);
      message.success(isAdmin ? 'Joined as admin observer' : 'Joined call successfully');
    }
  }, [isConnected, isJoined, isAdmin]);

  // Handle audio toggle
  const toggleAudio = async () => {
    if (localMicrophoneTrack) {
      await localMicrophoneTrack.setMuted(isAudioMuted);
      setIsAudioMuted(!isAudioMuted);
    }
  };

  // Handle video toggle
  const toggleVideo = async () => {
    if (localCameraTrack) {
      await localCameraTrack.setMuted(isVideoMuted);
      setIsVideoMuted(!isVideoMuted);
    }
  };

  // Handle leave call
  const leaveCall = async () => {
    try {
      await agoraEngine.leave();
      setIsJoined(false);
      onCallEnd();
    } catch (error) {
      console.error('Error leaving call:', error);
      onCallEnd();
    }
  };

  if (isJoining) {
    return (
      <Card style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Space direction="vertical" align="center">
          <VideoCameraOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
          <Text>Connecting to call...</Text>
        </Space>
      </Card>
    );
  }

  return (
    <div style={{ height: '100%', backgroundColor: '#000', position: 'relative' }}>
      {/* Video Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: remoteUsers.length > 0 
          ? `repeat(${Math.min(remoteUsers.length + 1, 4)}, 1fr)` 
          : '1fr',
        gap: '10px',
        padding: '10px',
        height: 'calc(100% - 80px)'
      }}>
        {/* Local Video */}
        <Card
          style={{
            backgroundColor: '#1f1f1f',
            border: isAdmin ? '2px solid #faad14' : '1px solid #333',
            minHeight: '250px'
          }}
          bodyStyle={{ padding: '8px', position: 'relative', height: '100%' }}
        >
          <div style={{
            width: '100%',
            height: '250px',
            backgroundColor: '#000',
            borderRadius: '8px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {localCameraTrack && !isVideoMuted ? (
              <LocalVideoTrack 
                track={localCameraTrack} 
                play={true}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <Avatar size={64} icon={<UserOutlined />} style={{ backgroundColor: '#666' }} />
            )}
          </div>
          
          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            color: 'white',
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px'
          }}>
            <Space>
              {isAdmin && <CrownOutlined style={{ color: '#faad14' }} />}
              <Text style={{ color: 'white' }}>
                {isAdmin ? 'Admin (You)' : 'You'}
              </Text>
              {isAudioMuted && <AudioMutedOutlined style={{ color: '#ff4d4f' }} />}
              {isVideoMuted && <VideoCameraAddOutlined style={{ color: '#ff4d4f' }} />}
            </Space>
          </div>
        </Card>

        {/* Remote Users */}
        {remoteUsers.map((user) => (
          <Card
            key={user.uid}
            style={{ 
              backgroundColor: '#1f1f1f', 
              border: '1px solid #333',
              minHeight: '250px'
            }}
            bodyStyle={{ padding: '8px', position: 'relative', height: '100%' }}
          >
            <div style={{
              width: '100%',
              height: '250px',
              backgroundColor: '#000',
              borderRadius: '8px',
              position: 'relative'
            }}>
              <RemoteUser 
                user={user} 
                playVideo={true}
                playAudio={true}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
            
            <div style={{
              position: 'absolute',
              bottom: '16px',
              left: '16px',
              color: 'white',
              backgroundColor: 'rgba(0,0,0,0.7)',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px'
            }}>
              <Space>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#52c41a'
                }} />
                <Text style={{ color: 'white' }}>
                  {user.uid === 999999 ? 'Admin' : `User ${user.uid}`}
                </Text>
              </Space>
            </div>
          </Card>
        ))}
      </div>

      {/* Call Controls */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(0,0,0,0.8)',
        borderRadius: '25px',
        padding: '10px 20px',
        backdropFilter: 'blur(10px)'
      }}>
        <Space size="large">
          <Button
            type={isAudioMuted ? "primary" : "default"}
            danger={isAudioMuted}
            shape="circle"
            size="large"
            icon={isAudioMuted ? <AudioMutedOutlined /> : <AudioOutlined />}
            onClick={toggleAudio}
            title={isAudioMuted ? "Unmute microphone" : "Mute microphone"}
          />
          <Button
            type={isVideoMuted ? "primary" : "default"}
            danger={isVideoMuted}
            shape="circle"
            size="large"
            icon={isVideoMuted ? <VideoCameraAddOutlined /> : <VideoCameraOutlined />}
            onClick={toggleVideo}
            title={isVideoMuted ? "Turn on camera" : "Turn off camera"}
          />
          <Button
            type="primary"
            danger
            shape="circle"
            size="large"
            icon={<DisconnectOutlined />}
            onClick={leaveCall}
            title="Leave call"
          />
        </Space>
      </div>

      {/* Admin Badge */}
      {isAdmin && (
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          backgroundColor: '#faad14',
          color: '#000',
          padding: '8px 16px',
          borderRadius: '20px',
          fontWeight: 'bold',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
        }}>
          <Space>
            <CrownOutlined />
            Admin Observer
          </Space>
        </div>
      )}

      {/* Connection Status */}
      {isJoined && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          backgroundColor: 'rgba(82, 196, 26, 0.9)',
          color: 'white',
          padding: '4px 12px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '500'
        }}>
          <Space>
            <div style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: 'white'
            }} />
            Connected
          </Space>
        </div>
      )}
    </div>
  );
};

// Main component with AgoraRTCProvider
const AgoraVideoCall = ({ channelName, userId, token, onCallEnd, isAdmin = false }) => {
  console.log("token from agora>>>", token);
  console.log("AGORA_APP_ID from agora>>>", AGORA_APP_ID);

  // Create Agora client
  const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

  return (
    <AgoraRTCProvider client={client}>
      <VideoCallRoom
        channelName={channelName}
        userId={userId}
        token={token}
        onCallEnd={onCallEnd}
        isAdmin={isAdmin}
      />
    </AgoraRTCProvider>
  );
};

export default AgoraVideoCall;