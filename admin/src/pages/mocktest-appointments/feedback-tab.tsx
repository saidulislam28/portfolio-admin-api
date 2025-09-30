
/* eslint-disable */
import {
    CheckCircleOutlined,
    FileTextOutlined
} from "@ant-design/icons";
import {
    Card,
    Col,
    List,
    Progress,
    Row,
    Space,
    Tabs,
    Typography
} from "antd";
import React from "react";


const {  Text, Paragraph } = Typography;
const renderFeedbackTab = ({
    feedbackData,
}) => {
    return (
        <Card
            title={
                <Space>
                    <FileTextOutlined />
                    <Text strong>Mock Test Feedback</Text>
                </Space>
            }
        >
            <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                    <Card title="Test Information">
                        <Space direction="vertical">
                            <div>
                                <Text strong>Test Date:</Text>
                                <br />
                                <Text>
                                    {feedbackData?.testDate
                                        ? new Date(feedbackData.testDate).toLocaleDateString()
                                        : "N/A"}
                                </Text>
                            </div>
                            <div>
                                <Text strong>Test Time:</Text>
                                <br />
                                <Text>{feedbackData?.testTime ?? "N/A"}</Text>
                            </div>
                            <div>
                                <Text strong>Overall Band Score:</Text>
                                <br />
                                <Progress
                                    type="circle"
                                    percent={(feedbackData?.overallBandScore / 9) * 100}
                                    format={() => (
                                        <Text strong>
                                            {feedbackData?.overallBandScore ?? "N/A"}
                                        </Text>
                                    )}
                                    width={100}
                                    strokeColor={
                                        feedbackData?.overallBandScore >= 7
                                            ? "#52c41a"
                                            : feedbackData?.overallBandScore >= 5
                                                ? "#faad14"
                                                : "#f5222d"
                                    }
                                />
                            </div>
                        </Space>
                    </Card>
                </Col>

                <Col xs={24} md={16}>
                    <Card title="Detailed Assessment">
                        <Row gutter={[16, 16]}>
                            <Col xs={24} md={12}>
                                <Card title="Fluency & Coherence" size="small">
                                    <Progress
                                        percent={(feedbackData?.fluencyCoherence / 9) * 100}
                                        format={() => `${feedbackData?.fluencyCoherence ?? 0}`}
                                        status={
                                            feedbackData?.fluencyCoherence >= 7
                                                ? "success"
                                                : feedbackData?.fluencyCoherence >= 5
                                                    ? "normal"
                                                    : "exception"
                                        }
                                    />
                                    <List
                                        size="small"
                                        dataSource={[
                                            {
                                                label: "Speaks fluently",
                                                value: feedbackData?.fluencyFluent,
                                            },
                                            {
                                                label: "Natural flow",
                                                value: feedbackData?.fluencyNaturalFlow,
                                            },
                                            {
                                                label: "Needs coherence",
                                                value: feedbackData?.fluencyNeedsCoherence,
                                            },
                                            {
                                                label: "Repeats ideas",
                                                value: feedbackData?.fluencyRepeatsIdeas,
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
                                    <Progress
                                        percent={(feedbackData?.lexicalResource / 9) * 100}
                                        format={() => `${feedbackData?.lexicalResource ?? 0}`}
                                        status={
                                            feedbackData?.lexicalResource >= 7
                                                ? "success"
                                                : feedbackData?.lexicalResource >= 5
                                                    ? "normal"
                                                    : "exception"
                                        }
                                    />
                                    <List
                                        size="small"
                                        dataSource={[
                                            {
                                                label: "Good variety",
                                                value: feedbackData?.lexicalGoodVariety,
                                            },
                                            {
                                                label: "Repetitive",
                                                value: feedbackData?.lexicalRepetitive,
                                            },
                                            {
                                                label: "Topic mismatch",
                                                value: feedbackData?.lexicalTopicMismatch,
                                            },
                                            {
                                                label: "Limited range",
                                                value: feedbackData?.lexicalLimitedRange,
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
                                    <Progress
                                        percent={(feedbackData?.grammaticalRange / 9) * 100}
                                        format={() => `${feedbackData?.grammaticalRange ?? 0}`}
                                        status={
                                            feedbackData?.grammaticalRange >= 7
                                                ? "success"
                                                : feedbackData?.grammaticalRange >= 5
                                                    ? "normal"
                                                    : "exception"
                                        }
                                    />
                                    <List
                                        size="small"
                                        dataSource={[
                                            {
                                                label: "Frequent errors",
                                                value: feedbackData?.grammarFrequentErrors,
                                            },
                                            {
                                                label: "Tense issues",
                                                value: feedbackData?.grammarTenseIssues,
                                            },
                                            {
                                                label: "Limited range",
                                                value: feedbackData?.grammarLimitedRange,
                                            },
                                            {
                                                label: "Mostly accurate",
                                                value: feedbackData?.grammarMostlyAccurate,
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
                                    <Progress
                                        percent={(feedbackData?.pronunciation / 9) * 100}
                                        format={() => `${feedbackData?.pronunciation ?? 0}`}
                                        status={
                                            feedbackData?.pronunciation >= 7
                                                ? "success"
                                                : feedbackData?.pronunciation >= 5
                                                    ? "normal"
                                                    : "exception"
                                        }
                                    />
                                    <List
                                        size="small"
                                        dataSource={[
                                            {
                                                label: "Clear sounds",
                                                value: feedbackData?.pronunciationClearSounds,
                                            },
                                            {
                                                label: "Good stress",
                                                value: feedbackData?.pronunciationGoodStress,
                                            },
                                            {
                                                label: "Mispronunciations",
                                                value: feedbackData?.pronunciationMispronunciations,
                                            },
                                            {
                                                label: "Accent issues",
                                                value: feedbackData?.pronunciationAccentIssues,
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

                    <Card title="Part-Specific Feedback" style={{ marginTop: 16 }}>
                        <Row gutter={[16, 16]}>
                            <Col xs={24} md={8}>
                                <Card title="Part 1" size="small">
                                    <List
                                        size="small"
                                        dataSource={[
                                            {
                                                label: "Confident",
                                                value: feedbackData?.part1Confident,
                                            },
                                            {
                                                label: "Short answers",
                                                value: feedbackData?.part1ShortAnswer,
                                            },
                                            {
                                                label: "Needs more details",
                                                value: feedbackData?.part1NeedsMoreDetails,
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
                            <Col xs={24} md={8}>
                                <Card title="Part 2" size="small">
                                    <List
                                        size="small"
                                        dataSource={[
                                            {
                                                label: "Well organized",
                                                value: feedbackData?.part2WellOrganized,
                                            },
                                            {
                                                label: "Missed points",
                                                value: feedbackData?.part2MissedPoints,
                                            },
                                            {
                                                label: "Too short",
                                                value: feedbackData?.part2TooShort,
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
                            <Col xs={24} md={8}>
                                <Card title="Part 3" size="small">
                                    <List
                                        size="small"
                                        dataSource={[
                                            {
                                                label: "Insightful",
                                                value: feedbackData?.part3Insightful,
                                            },
                                            {
                                                label: "Repetitive",
                                                value: feedbackData?.part3Repetitive,
                                            },
                                            {
                                                label: "Too short",
                                                value: feedbackData?.part3TooShort,
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

                    <Card title="Recommendations" style={{ marginTop: 16 }}>
                        <List
                            size="small"
                            dataSource={[
                                {
                                    label: "Practice cue cards",
                                    value: feedbackData?.recPracticeCueCard,
                                },
                                {
                                    label: "Expand topic vocabulary",
                                    value: feedbackData?.recExpandTopicVocab,
                                },
                                {
                                    label: "Reduce grammar mistakes",
                                    value: feedbackData?.recReduceGrammarMistakes,
                                },
                                {
                                    label: "Watch native conversations",
                                    value: feedbackData?.recWatchNativeConversations,
                                },
                                {
                                    label: "Use linking phrases",
                                    value: feedbackData?.recUseLinkingPhrases,
                                },
                                {
                                    label: "Improve fluency",
                                    value: feedbackData?.recImproveFluency,
                                },
                                {
                                    label: "Improve pronunciation",
                                    value: feedbackData?.recImprovePronunciation,
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

                    <Card title="Additional Notes" style={{ marginTop: 16 }}>
                        <Paragraph>{feedbackData?.additionalNotes}</Paragraph>
                    </Card>
                </Col>
            </Row>
        </Card>
    );
};

export default renderFeedbackTab;