/* eslint-disable */
import {
    CheckCircleOutlined,
    FileTextOutlined
} from "@ant-design/icons";
import {
    Avatar,
    Card,
    Col,
    Divider,
    List,
    Progress,
    Row,
    Space,
    Typography
} from "antd";
import React from "react";

const { Text, Paragraph } = Typography;

const renderFeedbackTab = ({
    conversationFeedback,
    appointmentData,
}) => {


    return (
        <div>
            <Card
                title={
                    <Space>
                        <FileTextOutlined />
                        <span>Conversation Test Feedback</span>
                    </Space>
                }
            >
                <Row gutter={[24, 24]}>
                    <Col xs={24} md={8}>
                        <Card title="Test Information">
                            <Space direction="vertical">
                                <div>
                                    <Text strong>Test Taker:</Text>
                                    <br />
                                    <Text>{conversationFeedback?.testTakerName}</Text>
                                </div>
                                <div>
                                    <Text strong>Test Date:</Text>
                                    <br />
                                    <Text>
                                        {conversationFeedback?.date
                                            ? new Date(appointmentData.ConversationFeedback.date).toLocaleDateString()
                                            : 'N/A'}
                                    </Text>
                                </div>
                                <div>
                                    <Text strong>Overall Level:</Text>
                                    <br />
                                    <Progress
                                        type="circle"
                                        percent={
                                            conversationFeedback?.overallLevel === 'Advanced' ? 90 :
                                                conversationFeedback?.overallLevel === 'Intermediate' ? 60 :
                                                    conversationFeedback?.overallLevel === 'Beginner' ? 30 : 0
                                        }
                                        format={() => (
                                            <Text strong>{conversationFeedback?.overallLevel || 'N/A'}</Text>
                                        )}
                                        width={100}
                                        strokeColor={
                                            conversationFeedback?.overallLevel === 'Advanced' ? "#52c41a" :
                                                conversationFeedback?.overallLevel === 'Intermediate' ? "#faad14" : "#f5222d"
                                        }
                                    />
                                </div>
                            </Space>
                        </Card>

                        <Card title="Consultant" style={{ marginTop: 24 }}>
                            <Space direction="vertical">
                                <Avatar
                                    size={64}
                                    style={{ marginBottom: 12 }}
                                />
                                <Text strong>Consultant ID: {conversationFeedback?.consultant_id}</Text>
                            </Space>
                        </Card>
                    </Col>

                    <Col xs={24} md={16}>
                        <Card title="Detailed Assessment">
                            <Row gutter={[16, 16]}>
                                <Col xs={24} md={12}>
                                    <Card title="Fluency & Coherence" size="small">
                                        <List
                                            size="small"
                                            dataSource={[
                                                {
                                                    label: "Speaks fluently",
                                                    value: conversationFeedback?.speaksFluently,
                                                },
                                                {
                                                    label: "Occasional pauses",
                                                    value: conversationFeedback?.occasionalPauses,
                                                },
                                                {
                                                    label: "Often pauses",
                                                    value: conversationFeedback?.oftenPauses,
                                                },
                                                {
                                                    label: "Disorganized ideas",
                                                    value: conversationFeedback?.disorganizedIdeas,
                                                },
                                                {
                                                    label: "Needs longer answers",
                                                    value: conversationFeedback?.needsLongerAnswers,
                                                },
                                            ].filter(item => item.value)}
                                            renderItem={(item) => (
                                                <List.Item>
                                                    <CheckCircleOutlined style={{ color: "green" }} />
                                                    <Text style={{ marginLeft: 8 }}>{item.label}</Text>
                                                </List.Item>
                                            )}
                                        />
                                        <Divider orientation="left">Suggestions</Divider>
                                        <List
                                            size="small"
                                            dataSource={[
                                                {
                                                    label: "Use linking words",
                                                    value: conversationFeedback?.fluencyUseLinkingWords,
                                                },
                                                {
                                                    label: "Practice thinking in English",
                                                    value: conversationFeedback?.fluencyPracticeThinking,
                                                },
                                                {
                                                    label: "Speak with more details",
                                                    value: conversationFeedback?.fluencySpeakWithDetails,
                                                },
                                            ].filter(item => item.value)}
                                            renderItem={(item) => (
                                                <List.Item>
                                                    <CheckCircleOutlined style={{ color: "green" }} />
                                                    <Text style={{ marginLeft: 8 }}>{item.label}</Text>
                                                </List.Item>
                                            )}
                                        />
                                    </Card>
                                </Col>

                                <Col xs={24} md={12}>
                                    <Card title="Lexical Resource" size="small">
                                        <List
                                            size="small"
                                            dataSource={[
                                                {
                                                    label: "Wide vocabulary range",
                                                    value: conversationFeedback?.wideVocabularyRange,
                                                },
                                                {
                                                    label: "Repeats basic words",
                                                    value: conversationFeedback?.repeatsBasicWords,
                                                },
                                                {
                                                    label: "Uses topic terms",
                                                    value: conversationFeedback?.usesTopicTerms,
                                                },
                                                {
                                                    label: "Word choice errors",
                                                    value: conversationFeedback?.wordChoiceErrors,
                                                },
                                                {
                                                    label: "Lacks paraphrasing",
                                                    value: conversationFeedback?.lacksParaphrasing,
                                                },
                                            ].filter(item => item.value)}
                                            renderItem={(item) => (
                                                <List.Item>
                                                    <CheckCircleOutlined style={{ color: "green" }} />
                                                    <Text style={{ marginLeft: 8 }}>{item.label}</Text>
                                                </List.Item>
                                            )}
                                        />
                                        <Divider orientation="left">Suggestions</Divider>
                                        <List
                                            size="small"
                                            dataSource={[
                                                {
                                                    label: "Build vocabulary list",
                                                    value: conversationFeedback?.vocabBuildList,
                                                },
                                                {
                                                    label: "Practice synonyms",
                                                    value: conversationFeedback?.vocabPracticeSynonyms,
                                                },
                                                {
                                                    label: "Use vocabulary games",
                                                    value: conversationFeedback?.vocabUseGames,
                                                },
                                            ].filter(item => item.value)}
                                            renderItem={(item) => (
                                                <List.Item>
                                                    <CheckCircleOutlined style={{ color: "green" }} />
                                                    <Text style={{ marginLeft: 8 }}>{item.label}</Text>
                                                </List.Item>
                                            )}
                                        />
                                    </Card>
                                </Col>

                                <Col xs={24} md={12}>
                                    <Card title="Grammatical Range" size="small">
                                        <List
                                            size="small"
                                            dataSource={[
                                                {
                                                    label: "Mostly correct grammar",
                                                    value: conversationFeedback?.mostlyCorrectGrammar,
                                                },
                                                {
                                                    label: "Errors don't affect understanding",
                                                    value: conversationFeedback?.errorsDontAffect,
                                                },
                                                {
                                                    label: "Limited sentence types",
                                                    value: conversationFeedback?.limitedSentenceTypes,
                                                },
                                                {
                                                    label: "Frequent grammar mistakes",
                                                    value: conversationFeedback?.frequentGrammarMistakes,
                                                },
                                                {
                                                    label: "Needs complex structures",
                                                    value: conversationFeedback?.needsComplexStructures,
                                                },
                                            ].filter(item => item.value)}
                                            renderItem={(item) => (
                                                <List.Item>
                                                    <CheckCircleOutlined style={{ color: "green" }} />
                                                    <Text style={{ marginLeft: 8 }}>{item.label}</Text>
                                                </List.Item>
                                            )}
                                        />
                                        <Divider orientation="left">Suggestions</Divider>
                                        <List
                                            size="small"
                                            dataSource={[
                                                {
                                                    label: "Focus on tenses",
                                                    value: conversationFeedback?.grammarFocusTenses,
                                                },
                                                {
                                                    label: "Use conditionals",
                                                    value: conversationFeedback?.grammarUseConditionals,
                                                },
                                                {
                                                    label: "Write then speak",
                                                    value: conversationFeedback?.grammarWriteThenSpeak,
                                                },
                                            ].filter(item => item.value)}
                                            renderItem={(item) => (
                                                <List.Item>
                                                    <CheckCircleOutlined style={{ color: "green" }} />
                                                    <Text style={{ marginLeft: 8 }}>{item.label}</Text>
                                                </List.Item>
                                            )}
                                        />
                                    </Card>
                                </Col>

                                <Col xs={24} md={12}>
                                    <Card title="Pronunciation" size="small">
                                        <List
                                            size="small"
                                            dataSource={[
                                                {
                                                    label: "Pronunciation clear",
                                                    value: conversationFeedback?.pronunciationClear,
                                                },
                                                {
                                                    label: "Minor pronunciation issues",
                                                    value: conversationFeedback?.minorPronunciationIssues,
                                                },
                                                {
                                                    label: "Mispronounces key words",
                                                    value: conversationFeedback?.mispronouncesKeyWords,
                                                },
                                                {
                                                    label: "Lacks intonation",
                                                    value: conversationFeedback?.lacksIntonation,
                                                },
                                                {
                                                    label: "Strong L1 influence",
                                                    value: conversationFeedback?.strongL1Influence,
                                                },
                                            ].filter(item => item.value)}
                                            renderItem={(item) => (
                                                <List.Item>
                                                    <CheckCircleOutlined style={{ color: "green" }} />
                                                    <Text style={{ marginLeft: 8 }}>{item.label}</Text>
                                                </List.Item>
                                            )}
                                        />
                                        <Divider orientation="left">Suggestions</Divider>
                                        <List
                                            size="small"
                                            dataSource={[
                                                {
                                                    label: "Shadow speakers",
                                                    value: conversationFeedback?.pronShadowSpeakers,
                                                },
                                                {
                                                    label: "Record and check",
                                                    value: conversationFeedback?.pronRecordAndCheck,
                                                },
                                                {
                                                    label: "Practice phonemes",
                                                    value: conversationFeedback?.pronPracticePhonemes,
                                                },
                                            ].filter(item => item.value)}
                                            renderItem={(item) => (
                                                <List.Item>
                                                    <CheckCircleOutlined style={{ color: "green" }} />
                                                    <Text style={{ marginLeft: 8 }}>{item.label}</Text>
                                                </List.Item>
                                            )}
                                        />
                                    </Card>
                                </Col>
                            </Row>
                        </Card>

                        <Card title="General Comments" style={{ marginTop: 24 }}>
                            <Paragraph>
                                {conversationFeedback?.generalComments || 'No comments provided'}
                            </Paragraph>
                        </Card>
                    </Col>
                </Row>
            </Card>
        </div>
    )

};

export default renderFeedbackTab;