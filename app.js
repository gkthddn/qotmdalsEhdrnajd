// Firebase v9 모듈 가져오기 (CDN 방식)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// 💡 학생분의 Firebase 프로젝트 설정이 적용되었습니다!
const firebaseConfig = {
  apiKey: "AIzaSyBw899OfLP_yv167gAXRs03pY718S9at-o",
  authDomain: "qotmdals.firebaseapp.com",
  databaseURL: "https://qotmdals-default-rtdb.firebaseio.com",
  projectId: "qotmdals",
  storageBucket: "qotmdals.firebasestorage.app",
  messagingSenderId: "808542366841",
  appId: "1:808542366841:web:a8e8696798358e6728b8a8",
  measurementId: "G-BHM51QW9YM"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// 제공해주신 Google Apps Script 배포 URL
const GAS_URL = "https://script.google.com/macros/s/AKfycbyaOgzeur9oHxEH-z_YO7P8olVGRC-93drN2tSQWVojP0xxQ7PcgMJ768z68lJLHFSNNg/exec";

// DOM 요소 가져오기
const authSection = document.getElementById('auth-section');
const mainSection = document.getElementById('main-section');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const authMsg = document.getElementById('auth-msg');

let currentUser = null;
let lastAiResponse = ""; // TTS에 사용할 마지막 답변 저장용

// ----------------------------------------------------
// 1. Firebase Authentication (로그인/회원가입)
// ----------------------------------------------------
document.getElementById('signup-btn').addEventListener('click', () => {
    createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value)
        .then(() => alert("회원가입 성공!"))
        .catch(error => authMsg.innerText = "오류: " + error.message);
});

document.getElementById('login-btn').addEventListener('click', () => {
    signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value)
        .catch(error => authMsg.innerText = "오류: " + error.message);
});

document.getElementById('logout-btn').addEventListener('click', () => signOut(auth));

// 로그인 상태 감지 (로그인 성공 시 화면 전환 및 데이터 로드)
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        authSection.style.display = 'none';
        mainSection.style.display = 'block';
        document.getElementById('user-email').innerText = user.email;
        loadWorkoutLogs(); // 로그인 성공 시 기록 불러오기
    } else {
        currentUser = null;
        authSection.style.display = 'block';
        mainSection
