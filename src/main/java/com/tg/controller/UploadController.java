package com.tg.controller;

import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.net.URLConnection;
import java.nio.file.Files;

@Controller
public class UploadController {

    @PostMapping("/upload")
    @ResponseBody            // 1
    public String handleFile(@RequestPart(name = "fileupload") MultipartFile file) { // 2
        File uploadDirectory = new File("uploads");
        uploadDirectory.mkdirs();    // 3

        File oFile = new File("uploads/" + file.getOriginalFilename());
        try (
                OutputStream os = new FileOutputStream(oFile);
                InputStream inputStream = file.getInputStream()) {

            IOUtils.copy(inputStream, os); // 4
        } catch (IOException e) {
            e.printStackTrace();
            return "Wystąpił błąd podczas przesyłania pliku: " + e.getMessage();
        }

        return "ok!";
    }

    @GetMapping("image/{name}")
    public ResponseEntity<?> showImage(@PathVariable String name) throws IOException {
        File file = new File("uploads/" + name);
        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.valueOf(URLConnection.guessContentTypeFromName(name)))
                .body(Files.readAllBytes(file.toPath()));
    }
}
