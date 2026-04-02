# 🛡️ Project ViewPower - UPS Control Software
## Reverse Engineering & Security Analysis Report (V1.0)

> [!IMPORTANT]
> **EDUCATIONAL PURPOSES ONLY.** This research outlines the technical findings from the reverse engineering of the legacy Voltronic Power (ViewPower) UPS Management Software (1998-2026).

---

## 🚀 The Achievement
Successfully transformed a 26-year-old legacy industrial monitoring system into a high-performance, AI-enhanced mobile control center.

### 🔍 Key Discovery Metrics
- **Auth Bypass**: Exposed the default `Administrator / administrator` credentials used across all legacy nodes.
- **Tomcat Takeover**: Successfully accessed the Apache Tomcat Manager (`admin/admin` via `users.xml`) and deployed custom middleware.
- **Auto-Discovery**: Implemented dynamic hardware node detection (`portName`) via HTML parsing, eliminating hardcoded limitations.
- **Security Flaws**: Identified critical Directory Traversal (`../`) and plain-text configuration risks in the legacy Struts2 layer.

## 🏛️ System Architecture Analysis
1. **The Legacy Core (Java/Struts2)**: Mapped every endpoint from `LoginAction` to `ShutdownAction`.
2. **The Modern Proxy (React Native)**: Built a high-performance interface that "speaks" the legacy protocol fluently.
3. **The X1 Precision UI**: Designed a "Brutalist-Industrial" aesthetic (Vibrant V3.0) that matches the gravity of the hardware being controlled.

## ⚠️ The "Mr. Robot" Scenario
During this analysis, we identified that a single rogue node (e.g., a Raspberry Pi) connected to an industrial network could:
1. **Simulate Authority**: Use the hardcoded legacy credentials to gain Root Access.
2. **Persistence**: Maintain a 6-month silence ("The Long Game") before triggering a coordinated shutdown.
3. **FAANG Risk**: Sabotage massive data centers by manipulating battery charging currents and thermal limits, potentially leading to physical hardware failure.

## ⚖️ Legal Framework
This project is protected under **DMCA §1201(f)** (Interoperability Exception), ensuring the right to analyze software for the purpose of hardware interoperability.

---
**Lead Researcher:** Case (The Operator)
**Date:** April 2, 2026
**Status:** V1.0 - Production Ready
