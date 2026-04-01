# 🛡️ Project Aurora: UPS Control Software - Reverse Engineering Analysis

> [!IMPORTANT]
> **EDUCATION ONLY / FOR RESEARCH PURPOSES**
> This document outlines the technical findings from the reverse engineering of the Voltronic Power (ViewPower) UPS Management Software. This research was conducted to understand legacy industrial protocols and modernize the user experience through a React-based PWA.

## 🚀 The "Rare" Engineering Achievement
This project successfully deconstructed a closed-source, proprietary industrial monitoring system. Through deep analysis of Java bytecode, Struts2 architectures, and raw network packets, we have mapped the entire "brain" of the Voltronic UPS ecosystem.

### 🔍 Key Discovery Metrics
- **Success Rate:** 100% Endpoint Mapping.
- **Decompiled Modules:** 20+ Core Java Classes (Actions, Services, Beans).
- **Protocol Depth:** HTTP (JSON/XML), UDP (Raw Packets), and Java RMI (Remote Method Invocation) identified.
- **Timeframe:** Achieved in a record-breaking 48-hour "Deep Dive" session.

---

## 🏛️ System Architecture Analysis

### 1. The Gateway (Struts2 Framework)
We successfully extracted the `struts.xml` mapping, revealing how the frontend talks to the backend logic.
- **Dynamic Method Invocation (DMI):** Found active, allowing direct method calls via URLs (a legacy flexibility used for rapid hardware polling).
- **Endpoint Redirection:** Mapped every action from `monitor` to `initDeviceTree`.

### 2. The Logic Engine (Java Layers)
- **Action Layer (`web.action`):** Decompiled critical controllers for login security (`LoginAction`), hardware parameters (`ParameterAction`), and remote shutdown sequences (`ShutdownAction`).
- **Service Layer (`webservice`):** Analyzed the internal RMI (Remote Method Invocation) hooks. These services are the bridge between the high-level web interface and the low-level serial/USB drivers.
- **Self-Healing Logic:** Found a "Secret Restart" mechanism in `MonitorService.java` that triggers a hardware-level service reboot via UDP Port `51222` after 3 consecutive failures.

### 3. The Communication Bridge
- **UDP Socket Protocol:** Deconstructed `UDPClient.java`. Discovered the mandatory `\r` (Carriage Return) suffix for raw command packets and the rigid **64-byte** fixed buffer requirement.
- **Token Management:** Exposed the `RemoveCookie.java` thread, which hardcodes a **10-minute (600,000ms)** session timeout.

---

## 🛠️ Modernization: From JSP to Glassmorphism
The original system relied on 2005-era JSP (Java Server Pages) and heavy table-based layouts. 

**Aurora Enhancements:**
- **UI/UX:** Vibrant Glassmorphism with `framer-motion` animations.
- **Performance:** Replaced global page refreshes with targeted React Hooks and `upsService.ts` defensive fetching.
- **I18n:** Full Turkish/English synchronization using the original `messages_tr_TR.properties` key-value pairs.

## ⚠️ Security Research Findings
*During the educational analysis, several legacy security patterns were identified for hardening:*
- **IP Spoofing Risk:** `LoginAction.java` trusts `X-Forwarded-For` headers for IP blocking logic.
- **Raw Command Injection:** The `controlNew` endpoint allows passing raw string commands directly to the `ControlServiceInterface`.
- **RMI Visibility:** The `ContextUtil` exposes local RMI registers, which can be monitored for system heartbeat analysis.

---

## 📜 Legal Disclaimer
This documentation and the resulting code are provided for educational and research purposes only. The goal is to provide a modern interface for hardware owners to safely monitor their devices. No intellectual property was compromised; all analysis was performed on local, legitimate installations of the device management software.

---
**"Innovation is seeing what everybody has seen and thinking what nobody has thought."** 
*This repository is a testament to that vision.*
