---
title:          "UMIS-Mine: Robust RGB-D Instance Segmentation in Visually Degraded Underground Mine Scenes"
date:           2026-07-14 00:01:00 +0800
selected:       true
pub:            "International Conference on Intelligent Computing (ICIC), Springer, CCF-C"
pub_date:       "2026, pp. 3-14"
abstract: >-
  Instance segmentation in underground mines remains challenging due to severe visual degradation, including low illumination, dust interference, cluttered backgrounds, and frequent occlusions, which limit the development of embodied robotic perception. Although RGB-D sensing provides complementary appearance and geometric cues, effective multimodal fusion is hindered by cross-modal misalignment and modality-specific noise. To address these issues, we propose UMIS-Mine, a robust RGB-D instance segmentation framework for visually degraded underground mine scenes. The proposed framework adopts a dual-stream architecture and introduces a Feature Correction and Fusion module (FCFusion), which performs spatial cross-compensation and channel-level denoising to improve feature alignment and fusion robustness. In addition, we construct MUSeg-Ins, a new RGB-D instance segmentation dataset containing 3,171 aligned image pairs and 34,244 instance annotations across 11 categories. Evaluations on MUSeg-Ins and NYU Depth V2 demonstrate UMIS-Mine's superior accuracy and generalizability, achieving 51.5% and 49.3% mask mAP50 respectively, outperforming representative CNN and Transformer baselines. We further explore an optional Lightweight Shared Convolutional Decoder (LSCD) for resource-constrained deployment, which offers a compact alternative while revealing the trade-off between efficiency and segmentation accuracy.
cover:          /assets/images/pointphoto/umismain.png
authors:
  - Kaiyu Li
  - Feiteng Han
  - Yu Wang
  - Ming Xue
  - Xiao Zheng
links:
  Paper: https://doi.org/10.1007/978-981-92-3432-5_1
---
