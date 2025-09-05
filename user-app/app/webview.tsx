import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";
import Axios from "axios";

const payment_url = "YOUR_PAYMENT_URL_HERE"; // Replace with actual URL

const SSL = () => {
  const [loading, setLoading] = useState(true);
  const [html, setHtml] = useState("");

  useEffect(() => {
    const getPaymentPage = async () => {
      try {
        const payload = {
          mb_id: ""
        };
        const { data } = await Axios.post(payment_url, payload);

        const generatedHtml = `<html>
          <head>
            <meta charset="utf-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
          </head>
          <body>
            <a href="${data.response.GatewayPageURL}">
              Pay Now
            </a>
          </body>
        </html>`;

        setHtml(generatedHtml);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    getPaymentPage();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {!loading && (
        <WebView
          source={{ html, baseUrl: "web/" }}
          mixedContentMode="always"
          style={{ flex: 1 }}
          onMessage={(event) => {
            const message = event.nativeEvent.data;
            console.log(message);
            if (message === "payment completed") {
              // handle success
            }
          }}
        />
      )}
    </View>
  );
};

export default SSL;
