(function () {
  'use strict';

  const profiles = {
    sanskrit: { languages: ['sa-IN', 'sa', 'hi-IN', 'hi'], rate: 0.75, pitch: 0.92 },
    english: { languages: ['en-IN', 'en-US', 'en'], rate: 0.9, pitch: 1 },
    marathi: { languages: ['mr-IN', 'mr', 'hi-IN', 'hi'], rate: 0.85, pitch: 1 },
    hindi: { languages: ['hi-IN', 'hi'], rate: 0.85, pitch: 1 }
  };

  let voices = [];
  let activeUtterance = null;
  let activeLanguage = null;
  let stateListener = null;

  function refreshVoices() {
    voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
    return voices;
  }

  function getBestVoice(languageCodes) {
    const requested = (languageCodes || []).map((code) => code.toLowerCase());
    const available = refreshVoices();
    for (const code of requested) {
      const exact = available.find((voice) => voice.lang.toLowerCase() === code);
      if (exact) return exact;
    }
    for (const code of requested) {
      const base = code.split('-')[0];
      const close = available.find((voice) => voice.lang.toLowerCase().split('-')[0] === base);
      if (close) return close;
    }
    return null;
  }

  function normalizeSanskrit(text) {
    return String(text || '')
      .replace(/\*+/g, '')
      .replace(/["“”‘’]/g, '')
      .replace(/\|/g, ', ')
      .replace(/[॥]+/g, '.')
      .replace(/[।]+/g, '.')
      .replace(/\s*\n\s*/g, '. ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function setState(state, language) {
    activeLanguage = state === 'idle' ? null : language;
    if (typeof stateListener === 'function') stateListener(state, activeLanguage);
  }

  function speak(text, language, options) {
    if (!('speechSynthesis' in window)) {
      throw new Error('Speech synthesis is not supported in this browser.');
    }
    const profile = profiles[language] || profiles.english;
    const settings = options || {};
    const utteranceText = language === 'sanskrit' ? normalizeSanskrit(text) : String(text || '').trim();
    if (!utteranceText) return;

    stop();
    const utterance = new SpeechSynthesisUtterance(utteranceText);
    const voice = getBestVoice(profile.languages);
    utterance.voice = voice || null;
    utterance.lang = voice ? voice.lang : profile.languages[0];
    utterance.rate = settings.rate || profile.rate;
    utterance.pitch = settings.pitch || profile.pitch;
    utterance.onstart = function () { setState('playing', language); };
    utterance.onend = function () { if (activeUtterance === utterance) { activeUtterance = null; setState('idle'); } };
    utterance.onerror = function () { if (activeUtterance === utterance) { activeUtterance = null; setState('idle'); } };
    activeUtterance = utterance;
    activeLanguage = language;
    window.speechSynthesis.speak(utterance);
  }

  function pause() {
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setState('paused', activeLanguage);
    }
  }

  function resume() {
    if ('speechSynthesis' in window && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setState('playing', activeLanguage);
    }
  }

  function stop() {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    activeUtterance = null;
    setState('idle');
  }

  function isSanskritVoiceAvailable() {
    return !!getBestVoice(['sa-IN', 'sa']);
  }

  function onStateChange(listener) {
    stateListener = listener;
  }

  if ('speechSynthesis' in window) {
    refreshVoices();
    window.speechSynthesis.addEventListener('voiceschanged', refreshVoices);
  }

  window.GanpatiSpeech = { getBestVoice, normalizeSanskrit, speak, pause, resume, stop, isSanskritVoiceAvailable, onStateChange };
}());
