// Voice Search Module for Tracking Page
class VoiceSearch {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.isSupported = false;
    this.currentLanguage = "en-US";

    this.initializeElements();
    this.checkBrowserSupport();
    this.initializeRecognition();
    this.bindEvents();
  }

  initializeElements() {
    this.voiceSearchBtn = document.getElementById("voiceSearchBtn");
    this.trackingInput = document.getElementById("trackingId");
    this.voiceStatus = document.getElementById("voiceStatus");
    this.statusText = this.voiceStatus.querySelector(".status-text");
    this.pulseDot = this.voiceStatus.querySelector(".pulse-dot");
    this.languageSelect = document.getElementById("languageSelect");

    // Create modal for voice input
    this.createVoiceModal();
  }

  createVoiceModal() {
    this.voiceModal = document.createElement("div");
    this.voiceModal.className = "voice-modal";
    this.voiceModal.innerHTML = `
            <div class="voice-modal-content">
                <div class="voice-modal-icon">
                    <i class="fas fa-microphone"></i>
                </div>
                <div class="voice-modal-text" id="modalStatus">Speak Now</div>
                <div class="voice-modal-instruction" id="modalInstruction">
                    Please speak your tracking ID clearly. Example: "T R K 1 2 3 4 5"
                </div>
                <div class="voice-wave">
                    <div class="voice-bar"></div>
                    <div class="voice-bar"></div>
                    <div class="voice-bar"></div>
                    <div class="voice-bar"></div>
                    <div class="voice-bar"></div>
                </div>
                <div class="voice-modal-actions">
                    <button class="voice-modal-btn secondary" id="cancelVoice">Cancel</button>
                    <button class="voice-modal-btn primary" id="tryAgainVoice" style="display: none;">Try Again</button>
                </div>
            </div>
        `;
    document.body.appendChild(this.voiceModal);

    this.modalStatus = document.getElementById("modalStatus");
    this.modalInstruction = document.getElementById("modalInstruction");
    this.cancelVoiceBtn = document.getElementById("cancelVoice");
    this.tryAgainVoiceBtn = document.getElementById("tryAgainVoice");
  }

  checkBrowserSupport() {
    this.isSupported =
      "webkitSpeechRecognition" in window || "SpeechRecognition" in window;

    if (!this.isSupported) {
      this.disableVoiceSearch("Voice search not supported in your browser");
      return false;
    }
    return true;
  }

  initializeRecognition() {
    if (!this.isSupported) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();

    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 3;

    this.recognition.onstart = () => this.onRecognitionStart();
    this.recognition.onresult = (event) => this.onRecognitionResult(event);
    this.recognition.onerror = (event) => this.onRecognitionError(event);
    this.recognition.onend = () => this.onRecognitionEnd();
  }

  bindEvents() {
    // Voice search button
    this.voiceSearchBtn.addEventListener("click", () =>
      this.toggleVoiceSearch()
    );

    // Language change
    this.languageSelect.addEventListener("change", (e) => {
      this.currentLanguage = e.target.value;
      if (this.recognition) {
        this.recognition.lang = this.currentLanguage;
      }
    });

    // Modal buttons
    this.cancelVoiceBtn.addEventListener("click", () => this.stopListening());
    this.tryAgainVoiceBtn.addEventListener("click", () =>
      this.startListening()
    );

    // Close modal on outside click
    this.voiceModal.addEventListener("click", (e) => {
      if (e.target === this.voiceModal) {
        this.stopListening();
      }
    });
  }

  toggleVoiceSearch() {
    if (this.isListening) {
      this.stopListening();
    } else {
      this.startListening();
    }
  }

  startListening() {
    if (!this.isSupported) {
      this.showError("Voice search is not supported in your browser");
      return;
    }

    try {
      this.recognition.lang = this.currentLanguage;
      this.recognition.start();
      this.isListening = true;

      // Update UI
      this.voiceSearchBtn.classList.add("listening");
      this.pulseDot.classList.add("listening");
      this.statusText.textContent = "Listening... Speak now";

      // Show modal
      this.showVoiceModal();
    } catch (error) {
      console.error("Error starting voice recognition:", error);
      this.showError("Failed to start voice recognition");
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
    this.isListening = false;

    // Update UI
    this.voiceSearchBtn.classList.remove("listening");
    this.pulseDot.classList.remove("listening");
    this.statusText.textContent = "Ready for voice input";

    // Hide modal
    this.hideVoiceModal();
  }

  onRecognitionStart() {
    console.log("Voice recognition started");
    this.modalStatus.textContent = "Listening...";
    this.modalInstruction.textContent = "Please speak your tracking ID clearly";
    this.tryAgainVoiceBtn.style.display = "none";
  }

  onRecognitionResult(event) {
    let finalTranscript = "";
    let interimTranscript = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript += transcript;
      }
    }

    // Update modal with interim results
    if (interimTranscript) {
      this.modalStatus.textContent = `Heard: "${interimTranscript}"`;
    }

    // Process final result
    if (finalTranscript) {
      this.processVoiceResult(finalTranscript);
    }
  }

  onRecognitionError(event) {
    console.error("Speech recognition error:", event.error);

    let errorMessage = "Voice recognition error";
    switch (event.error) {
      case "not-allowed":
      case "permission-denied":
        errorMessage =
          "Microphone permission denied. Please allow microphone access.";
        break;
      case "network":
        errorMessage = "Network error occurred. Please check your connection.";
        break;
      case "no-speech":
        errorMessage = "No speech detected. Please try again.";
        break;
      case "audio-capture":
        errorMessage = "No microphone found. Please check your microphone.";
        break;
      case "aborted":
        // User manually stopped, no error message needed
        return;
      default:
        errorMessage = `Error: ${event.error}`;
    }

    this.showError(errorMessage);
    this.stopListening();
  }

  onRecognitionEnd() {
    console.log("Voice recognition ended");
    this.isListening = false;
    this.voiceSearchBtn.classList.remove("listening");
    this.pulseDot.classList.remove("listening");

    // Show try again button if modal is still open
    if (this.voiceModal.classList.contains("active")) {
      this.modalStatus.textContent = "Recognition ended";
      this.tryAgainVoiceBtn.style.display = "inline-block";
    }
  }

  processVoiceResult(transcript) {
    // Clean and validate the tracking ID
    let trackingId = this.cleanTrackingId(transcript);

    if (this.isValidTrackingId(trackingId)) {
      // Set the tracking ID in the input
      this.trackingInput.value = trackingId;

      // Update UI
      this.modalStatus.textContent = `Tracking ID set: ${trackingId}`;
      this.modalInstruction.textContent = 'Click "Track Vehicle" to search';
      this.statusText.textContent = `Voice input successful: ${trackingId}`;
      this.pulseDot.style.background = "#27ae60";

      // Auto-submit after a short delay
      setTimeout(() => {
        this.hideVoiceModal();
        document
          .getElementById("trackingForm")
          .dispatchEvent(new Event("submit"));
      }, 1500);
    } else {
      this.showError(
        `Invalid tracking ID format: "${trackingId}". Please try again.`
      );
      this.tryAgainVoiceBtn.style.display = "inline-block";
    }
  }

  cleanTrackingId(transcript) {
    // Remove extra spaces and convert to uppercase
    let cleaned = transcript.trim().toUpperCase();

    // Handle common speech recognition variations
    cleaned = cleaned.replace(/\s+/g, " "); // Multiple spaces to single space

    // Fix common speech-to-text issues
    cleaned = cleaned.replace(/TRACKING/g, "TRK");
    cleaned = cleaned.replace(/TRACK/g, "TRK");
    cleaned = cleaned.replace(/T R K/g, "TRK");
    cleaned = cleaned.replace(/T\.R\.K/g, "TRK");

    // Remove non-alphanumeric characters except spaces and hyphens
    cleaned = cleaned.replace(/[^A-Z0-9\s\-]/g, "");

    // Remove spaces for final format
    cleaned = cleaned.replace(/\s/g, "");

    return cleaned;
  }

  isValidTrackingId(trackingId) {
    // Basic validation for tracking ID format (TRK followed by numbers)
    const trackingRegex = /^TRK\d{5}$/;
    return trackingRegex.test(trackingId);
  }

  showVoiceModal() {
    this.voiceModal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  hideVoiceModal() {
    this.voiceModal.classList.remove("active");
    document.body.style.overflow = "";
    this.resetVoiceStatus();
  }

  showError(message) {
    this.statusText.textContent = message;
    this.pulseDot.classList.add("error");
    this.pulseDot.style.background = "#e74c3c";

    if (this.voiceModal.classList.contains("active")) {
      this.modalStatus.textContent = "Error";
      this.modalInstruction.textContent = message;
      this.tryAgainVoiceBtn.style.display = "inline-block";
    }

    // Reset error state after 5 seconds
    setTimeout(() => {
      this.resetVoiceStatus();
    }, 5000);
  }

  resetVoiceStatus() {
    this.statusText.textContent = "Ready for voice input";
    this.pulseDot.classList.remove("error", "listening");
    this.pulseDot.style.background = "#27ae60";
  }

  disableVoiceSearch(message) {
    this.voiceSearchBtn.disabled = true;
    this.voiceSearchBtn.title = message;
    this.statusText.textContent = message;
    this.pulseDot.style.background = "#666";
  }
}

// Initialize voice search when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.voiceSearch = new VoiceSearch();
});

// Utility function to set tracking ID (for sample IDs)
function setTrackingId(id) {
  document.getElementById("trackingId").value = id;
  document.getElementById("trackingForm").dispatchEvent(new Event("submit"));
}
