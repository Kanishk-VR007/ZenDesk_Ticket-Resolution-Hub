package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;

public class CommentRequestDto {
    @NotBlank(message = "We must need the content")
    private String content;
    private boolean isInternal;
    public String getContent() {
        return content;
    }
    public void setContent(String content) {
        this.content = content;
    }
    public boolean isInternal() {
        return isInternal;
    }
    public void setInternal(boolean isInternal) {
        this.isInternal = isInternal;
    }
}
