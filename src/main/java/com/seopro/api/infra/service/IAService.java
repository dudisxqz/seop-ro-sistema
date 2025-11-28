package com.seopro.api.infra.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.json.JSONObject;
import org.json.JSONArray;

@Service
public class IAService {

    @Value("${openai.api.key}")
    private String apiKey;

    private final String OPENAI_URL = "https://api.openai.com/v1/chat/completions";

    public String melhorarTexto(String textoOriginal) {
        if (textoOriginal == null || textoOriginal.isBlank()) return "";

        try {
            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + apiKey);


            String prompt = "Reescreva a seguinte ocorrência escolar de forma formal, pedagógica e objetiva para um relatório oficial: " + textoOriginal;

            String requestBody = """
                {
                    "model": "gpt-3.5-turbo",
                    "messages": [
                        {"role": "user", "content": "%s"}
                    ],
                    "temperature": 0.7
                }
                """.formatted(prompt.replace("\n", " ").replace("\"", "'"));


            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(OPENAI_URL, entity, String.class);

            JSONObject jsonResponse = new JSONObject(response.getBody());
            JSONArray choices = jsonResponse.getJSONArray("choices");
            String textoGerado = choices.getJSONObject(0).getJSONObject("message").getString("content");

            return textoGerado;

        } catch (Exception e) {
            e.printStackTrace();
            return "Erro ao consultar IA: " + e.getMessage();
        }
    }
}