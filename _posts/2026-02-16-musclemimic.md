---
layout: distill
title: "Towards Embodied AI with MuscleMimic: Unlocking full-body musculoskeletal motor learning at scale"
description: An open-source framework for scalable motion imitation learning with physiologically realistic, muscle-actuated humanoids.
date: 2026-02-16
future: true

authors:
  - name: Chengkun Li*
    url: "https://chengkunli.github.io"
    affiliations:
      name: EPFL
  - name: Cheryl Wang*
    affiliations:
      name: McGill University
  - name: Bianca Ziliotto
    affiliations:
      name: EPFL
  - name: Merkourios Simos
    affiliations:
      name: EPFL
  - name: Guillaume Durandau
    affiliations:
      name: McGill University
  - name: Alexander Mathis
    url: "https://www.mackenziemathislab.org/"
    affiliations:
      name: EPFL

bibliography: 2026-02-16-musclemimic.bib

_styles: >
  .video-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    margin: 2rem 0;
  }
  .video-grid figure {
    margin: 0;
  }
  .video-grid video {
    width: 100%;
    border-radius: 8px;
  }
  .video-grid figcaption {
    font-size: 0.85rem;
    color: var(--global-text-color-light);
    margin-top: 0.5rem;
  }
  .image-row {
    display: flex;
    gap: 1rem;
    margin: 1.5rem 0;
    align-items: flex-start;
  }
  .image-row img {
    border-radius: 6px;
    height: auto;
  }
  .image-grid-2 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin: 1.5rem 0;
  }
  .image-grid-2 img {
    width: 100%;
    border-radius: 6px;
  }
  .image-grid-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin: 1.5rem 0;
  }
  .image-grid-3 img {
    width: 100%;
    border-radius: 6px;
  }
  .featured-video {
    margin: 2rem 0;
  }
  .featured-video video {
    width: 100%;
    border-radius: 8px;
  }
  .highlight-box {
    background: var(--global-code-bg-color);
    border-left: 3px solid var(--global-theme-color);
    padding: 1rem 1.25rem;
    border-radius: 0 6px 6px 0;
    margin: 1.5rem 0;
  }
  .highlight-box p {
    margin: 0;
  }
  .subfig-row {
    display: flex;
    gap: 1rem;
    margin: 1.5rem 0;
    align-items: flex-start;
  }
  .subfig-row img {
    border-radius: 6px;
    height: auto;
  }
---

Human motor control emerges from hundreds of muscles coordinating in real time, yet most simulated humanoids bypass this complexity entirely, relying on torque-driven joints that ignore the underlying neuromotor dynamics<d-cite key="Park2004,Aftab2016,peng2018deepmimic,Won2020"></d-cite>. While musculoskeletal (MSK) models built from cadaver and MRI data have brought us closer to biological realism<d-cite key="Christophy2011,Dorn2015,Rajagoapal2016,Seth2018,Adriaenssens2022"></d-cite>, they've been held back by computational cost (training takes days to weeks on CPUs<d-cite key="he2024dynsyn,simos2025kinesis,wang2025-ieee"></d-cite>) and limited to static validation or single-task evaluations. **Complex full-body models capable of diverse, dynamic movement have remained largely unexplored and only partially validated.**

**MuscleMimic** is an open-source framework that changes this. By combining full-body muscle-actuated humanoids with massively parallel GPU simulation via MuJoCo Warp<d-cite key="mujoco-warp"></d-cite>, we achieve order-of-magnitude training speedups, enabling a single generalist policy to learn thousands of human motions under full muscular control<d-cite key="arnold"></d-cite>. The framework provides two validated musculoskeletal embodiments, a retargeting pipeline that maps SMPL-format motion capture onto our models, and pretrained checkpoints that can be fine-tuned for subject-specific biomechanical analysis. Such capabilities are essential for realizing neuromechanical computational models that bridge brain, body, and behavior<d-cite key="wang2026embodied"></d-cite>.

<div class="highlight-box" markdown="1">

**Code, models, checkpoints, and retargeted dataset**: [github.com/amathislab/musclemimic](https://github.com/amathislab/musclemimic)

</div>

## What It Looks Like

All motions below are produced by a single generalist policy controlling **416 Hill-type muscles**.

<div class="video-grid">
  <figure>
    <video autoplay loop muted playsinline>
      <source src="/assets/videos/running.mp4" type="video/mp4">
    </video>
    <figcaption><strong>Running</strong>: Full-body locomotion with coordinated muscle actuation.</figcaption>
  </figure>
  <figure>
    <video autoplay loop muted playsinline>
      <source src="/assets/videos/airkick.mp4" type="video/mp4">
    </video>
    <figcaption><strong>Air Kick</strong>: Dynamic kicking motion with balance control.</figcaption>
  </figure>
  <figure>
    <video autoplay loop muted playsinline>
      <source src="/assets/videos/hold_leg_out.mp4" type="video/mp4">
    </video>
    <figcaption><strong>Leg Hold</strong>: Static balance demonstrating sustained muscle coordination.</figcaption>
  </figure>
  <figure>
    <video autoplay loop muted playsinline>
      <source src="/assets/videos/tennis_out.mp4" type="video/mp4">
    </video>
    <figcaption><strong>Tennis Swing</strong>: Athletic motion with full-body coordination.</figcaption>
  </figure>
</div>

Walking with corresponding synthetic muscle activation patterns:

<div class="featured-video">
  <video autoplay loop muted playsinline>
    <source src="/assets/videos/walking.mp4" type="video/mp4">
  </video>
</div>

### Imitation Learning Results

We evaluate the generalist policy on the KINESIS motion dataset using early termination as the primary quality signal: an episode terminates if the mean site deviation across 17 mimic sites relative to the root (pelvis) exceeds 0.3 m, or if the pelvis deviates from the reference by more than 0.5 m in world coordinates. We use *relative* rather than absolute position error because muscle activation dynamics introduce temporal delays that prevent the musculoskeletal model from perfectly tracking reference velocities.

| Metric | GMR-Fit (Train) | GMR-Fit (Test) |
|--------|----------------|----------------|
| Early termination rate | 0.108 | 0.129 |
| Joint position error | 0.129 | 0.130 |
| Joint velocity error | 0.542 | 0.545 |
| Root position error | 0.079 | 0.138 |
| Root yaw error | 0.048 | 0.047 |
| Relative site position error | 0.027 | 0.027 |
| Absolute site position error | 0.144 | 0.146 |
| Mean episode length | 534.1 | 528.1|
| Mean episode return | 575.9 | 569.1 |

<small>Validation metrics on KINESIS training (972 motions) and testing (108 motions) dataset.</small>

## The Models

MuscleMimic introduces two complementary musculoskeletal embodiments for motion learning centered on manipulation or locomotion.

| Model | Type | Joints | Muscles | DoFs | Focus |
|-------|------|--------|---------|------|-------|
| **BimanualMuscle** | Fixed-base | 76 (36\*) | 126 (64\*) | 54 (14\*) | Upper-body manipulation |
| **MyoFullBody** | Free-root | 123 (83\*) | 416 (354\*) | 72 (32\*) | Locomotion and manipulation |

<small>\* denotes configurations with finger muscles disabled for faster convergence. Joints denote articulated connections; DoFs correspond to independently controllable joint coordinates.</small>

Both models are built upon established MyoSuite components<d-cite key="caggiano2022myosuite"></d-cite>, incorporating MyoArm, MyoLegs, and MyoBack models<d-cite key="wang2022myosim,Walia2025"></d-cite>. **BimanualMuscle** provides a fixed-root upper-body configuration with 76 joints and 126 Hill-type muscle actuators for bimanual manipulation, with collision detection between the thorax and both arms. **MyoFullBody** extends this to a complete 123-joint system with 416 muscles spanning the full kinematic chain from pelvis to fingertips, supporting comprehensive collision detection for contact-rich locomotion and manipulation. During model development, each muscle-tendon moment arm was cross-validated to ensure continuity. **In total, around 150 asymmetries and muscle jumps were fixed** compared to the original MyoArm and MyoLegs models.

{% include figure.html path="assets/img/musclemimic/bimanual_model.png" alt="BimanualMuscle model" class="l-page" caption="Visualization of the BimanualMuscle model, viewed from (A) front, (B) back, and (C) side." %}

{% include figure.html path="assets/img/musclemimic/fullbody_model.png" alt="MyoFullBody model" class="l-page" caption="Visualization of the MyoFullBody model, viewed from (A) front, (B) back, and (C) side." %}

## Validation Against Human Data

To verify the biomechanical fidelity of our models during dynamic motion, we conduct population-based evaluations on walking and running against human experimental data on joint kinematics, kinetics, and EMG, as suggested in<d-cite key="Rajagoapal2016,Hicks2015"></d-cite>.

### Walking

We evaluate on five AMASS walking sequences, comparing against two experimental datasets (treadmill and level walking at 1.2 m/s, nine participants each of two datasets<d-cite key="Huawei2022dataset,koo2025dataset"></d-cite>). Simulated kinematics achieve a **mean correlation of 0.92 and 0.94** for treadmill and level walking respectively, with **0.71 for joint dynamics**. The lower-limb joints exhibit stereotyped gait patterns consistent with experimental literature: hip flexion at contact progressing to extension before toe-off, knee flexion during early stance for impact absorption, and rapid ankle plantarflexion for propulsion at toe-off.

{% include figure.html path="assets/img/musclemimic/gait_walk.png" alt="Walking gait analysis" class="l-page" caption="Representative joint kinematics of the left lower limb (hip, knee, ankle, and foot) over a full walking gait cycle, comparing human experimental data and MyoFullBody-generated motion. Human walking data were collected on a treadmill at 1.2 m/s (orange) and level walking with a mean velocity of 1.2 m/s (purple). Simulated results are evaluated on five AMASS walking sequences, aligned by ground reaction force onset and truncated to one gait cycle." %}

### Running

After fine-tuning the 10-billion-step checkpoint with an additional 50 million steps on 10 running motions, we compare against treadmill-running data at 1.75 m/s from Wang et al.<d-cite key="Huawei2022dataset"></d-cite>. Hip, knee, and ankle flexion over one gait cycle achieve a **mean correlation of 0.79**, with kinematic patterns consistent with the higher-energy demands of running, notably stronger plantarflexion at push-off and more pronounced knee flexion during swing.

{% include figure.html path="assets/img/musclemimic/gait_run.png" alt="Running gait analysis" class="l-page" caption="Representative joint kinematics of the left lower limb (hip, knee, ankle, and foot) over a full running gait cycle, comparing human experimental data and MyoFullBody-generated motion. Human running data were collected on a treadmill at 1.8 m/s. Simulated results aligned by ground reaction force onset and truncated to one gait cycle." %}

### EMG

We compare synthetic muscle activations against EMG recordings from two human walking datasets<d-cite key="Huawei2022dataset,koo2025dataset"></d-cite>. For three representative leg muscles (Vastus Medialis, Gastrocnemius Lateralis, Soleus Medialis), **the synthetic activations capture the main patterns of human EMG signals, achieving correlation values comparable to static optimization**. Results are shown alongside inter-subject variability, which represents an upper bound for model-human alignment.

<figure class="l-page">
  <div class="subfig-row">
    <img src="/assets/img/musclemimic/emg/Boo_with_examples.png" alt="EMG comparison — Boo et al." style="width: 62%;">
    <img src="/assets/img/musclemimic/emg/summary_metrics_Wang.png" alt="EMG summary — Wang et al." style="width: 38%;">
  </div>
  <figcaption><strong>(Left)</strong> Gait analysis with human data from Boo et al.<d-cite key="koo2025dataset"></d-cite> Individual muscle activation patterns and summary metrics. <strong>(Right)</strong> Summary metrics with human data from Wang et al.<d-cite key="Huawei2022dataset"></d-cite></figcaption>
</figure>

## How It Works

### Musculoskeletal Model

Both embodiments use Hill-type<d-cite key="hill1938heat"></d-cite> muscle actuators following MuJoCo<d-cite key="todorov2012mujoco"></d-cite> with inelastic tendons, where control signals pass through a first-order nonlinear activation dynamics model<d-cite key="Millard2013"></d-cite> that differentiates between activation and deactivation phases. We introduce tunable parameters, including muscle activation time constants and maximum active force per muscle, that can be independently adjusted for upper and lower limbs to accommodate highly dynamic motions. We observed that smaller activation time constants produce faster muscle responses but result in stiffer activations and noticeable jitter in the motion output. In contrast, larger time constants lead to smoother and more stable control, better suited for impulsive behaviors such as jumping, though they deviate further from biologically realistic activation dynamics <d-cite key="Thelen2003,Millard2013"></d-cite>. The contact geometries consist of capsules and ellipsoids <d-cite key="mujoco2023docs"></d-cite> across all body segments, with self-collision explicitly enabled. Both models are carefully fine-tuned to ensure bilateral symmetry in joint constraints, muscle moment arms, and force–length relationships.

### Motion Retargeting

We provide two retargeting pipelines that map SMPL-format motion capture data onto the musculoskeletal models. **Mocap-Body** uses a kinematic body in MuJoCo with a three-stage pipeline: SMPL shape fitting, inverse kinematics, and post-processing to remove artifacts such as floating and ground penetration. **GMR-Fit**<d-cite key="joao2025gmr,ze2025gmr"></d-cite> builds on the GMR robotics retargeting framework with our SMPL-fitting stage, enforcing joint constraints and dependencies to produce physiologically realistic trajectories.

| Metric | Mocap-Body | GMR-Fit |
|--------|-----------|---------|
| Joint limit violation (%) | 12.26 | **0.27** |
| Ground penetration (%) | 0.55 | **0.24** |
| Max penetration (m) | 0.002 | **0.001** |
| Tendon jump rate (%) | 30.14 | **3.20** |
| RMSE (m) | 0.039 | **0.025** |
| Speed per frame (s) | **0.076** | 0.251 |

GMR-Fit achieves dramatically better joint-limit satisfaction (0.27% vs 12.26% violation) and lower tendon jump rates (3.20% vs 30.14%), while Mocap-Body retains a ~3x speed advantage.

### Training

{% include figure.html path="assets/img/musclemimic/Policy.jpg" alt="Policy observation structure" caption="Policy observation structure. The state is decomposed into proprioceptive signals (root height and velocity, joint positions and velocities), tendon states, touch info, mimic site relative positions, and motion phase. A history of 3 stacked states is concatenated with the current goal and future goals at regular lookahead intervals. Each goal is defined by root position and velocity deltas and target mimic site relative positions." %}

## Training at Scale

MuscleMimic is implemented as a JAX-based framework extending LocoMuJoCo<d-cite key="al2023locomujoco"></d-cite> with native MuJoCo Warp support for GPU-accelerated simulation. We use a DeepMimic-like<d-cite key="peng2018deepmimic"></d-cite> reward combining joint-space and site-based imitation objectives with regularization penalties, and train an actor-critic architecture with SiLU activations<d-cite key="elfwing2018sigmoid"></d-cite>, optional LayerNorm<d-cite key="ba2016layer"></d-cite>, and orthogonal initialization<d-cite key="saxe2014exact"></d-cite>. The policy outputs a diagonal Gaussian over muscle activations. For training on diverse motion datasets, we use the KINESIS dataset<d-cite key="simos2025kinesis"></d-cite> (a curated subset of AMASS<d-cite key="mahmood2019amass"></d-cite>) and progressively scale to more dynamic motions including Embody3D<d-cite key="embody3d"></d-cite>. We use the Muon optimizer<d-cite key="jordan2024muon"></d-cite> for linear layers and Adam<d-cite key="DBLP:journals/corr/KingmaB14"></d-cite> for biases and normalization, which yields significantly faster convergence than AdamW<d-cite key="liu2025muon"></d-cite>.

**Single-epoch updates work best.** With massively parallel GPU simulation, we can collect fresh data cheaply, so single-epoch updates ($E = 1$) achieve superior asymptotic performance while avoiding pathologies from aggressive sample reuse: expert collapse in Soft MoE routing and severe distribution shift with KL divergence spikes orders of magnitude above the stable baseline.

{% include figure.html path="assets/img/musclemimic/epoch_ablation.png" alt="Effect of gradient epochs on training" caption="Effect of gradient epochs ($E$) on training stability. We compare $E=1$ (truly on-policy), $E=3$, and $E=10$ (aggressive sample reuse). (A) Early training (first 30M steps): higher $E$ accelerates initial learning. (B) Full training trajectory: $E=1$ achieves superior asymptotic performance. (C) KL divergence (log scale): $E>1$ exhibits catastrophic distribution shift with spikes exceeding $10^{10}$, whereas $E=1$ remains stable below $10^{-1}$." %}

**Larger batch sizes improve stability.** Larger batch sizes yield higher asymptotic rewards, lower KL divergence, and smoother convergence. Since larger batches require fewer gradient updates per environment step, training is also faster in wall-clock time.

{% include figure.html path="assets/img/musclemimic/batch_ablation.png" alt="Effect of batch size on training" caption="Effect of minibatch size on training dynamics. We compare minibatch sizes of $32$, $64$, and $128$. (A) Performance: larger batch sizes achieve higher asymptotic rewards. (B) Exploration stability: smaller batches cause the policy standard deviation to overshoot. (C) Policy update magnitude (log scale): larger batches yield lower KL divergence." %}

Training throughput scales directly with GPU hardware. Newer architectures such as NVIDIA H200 provide significant speedups in both simulation and gradient computation.

## Model Validation

Both models were extensively validated for muscle symmetry and biomechanical accuracy. Each muscle-tendon moment arm was cross-validated against its target joint to ensure smooth, continuous profiles, with wrapping geometries manually corrected whenever discontinuities were found. Most refinement concentrated around the shoulder joint, where multiple equality constraints are enforced.

<figure class="l-page">
  <div class="image-grid-2">
    <img src="/assets/img/refinement1.svg" alt="Muscle symmetry — BFLH across Knee Flexion">
    <img src="/assets/img/refinement2.svg" alt="Muscle symmetry — BIClong across Elbow Flexion">
  </div>
  <figcaption>Validation of symmetry between left and right muscle-tendon groups of MyoFullBody.</figcaption>
</figure>

Moment arms were further validated against experimental measurements from cadaver and MRI studies<d-cite key="Delp1990SurgerySimulation,Visser1990,Spoor1992,Herzog1993LinesOfAction,Hintermann1994,Pigeon1996,Wretenberg1996,Klein1996,Aper1996,Buford1997,Kellis1999,Arnold2000,Buford2001,PIAZZA2003,Ackland2008,Wilson2009,Sobczak2013,Fiorentino2013,Snoeck2021,Wang2021,Chen2025"></d-cite>. Despite inter-individual variability in reported values, the simulated profiles remain within experimentally observed ranges.

<figure class="l-page">
  <div class="image-grid-2">
    <img src="/assets/img/musclemimic/muscle_check/moment_arm_BRD.png" alt="BRD moment arm validation">
    <img src="/assets/img/musclemimic/muscle_check/moment_arm_Biceps femoris.png" alt="Biceps femoris moment arm validation">
  </div>
  <div class="image-grid-2">
    <img src="/assets/img/musclemimic/muscle_check/superior_lat_dorsi_abduction_validation.png" alt="Lat dorsi moment arm validation">
    <img src="/assets/img/musclemimic/muscle_check/moment_arm_Rectus femoris.png" alt="Rectus femoris moment arm validation">
  </div>
  <figcaption>Validation comparing MyoFullBody muscle moment arms against experimental data from prior studies for selected shoulder, elbow, and lower-limb muscles. Despite inter-individual variability, our model's profiles remain within the reported experimental ranges.</figcaption>
</figure>

## Limitations

While our framework demonstrates promising alignment with experimental data, musculoskeletal models remain approximations of biological reality. For example, the Hill-type model in MuJoCo simplifies complex phenomena such as history-dependent force production, heterogeneous fiber recruitment, and tendon elasticity. These assumptions can influence dynamic outcomes and may limit the faithful reproduction of highly explosive or high-impact motions (e.g., martial arts or rapid vertical jumping). Moreover, the current SMPL-based retargeting pipeline assumes generic morphology and matched gender, leaving open questions about how subject-specific anthropometrics affect retargeting accuracy and policy learning. Simulation results at the current stage should therefore be interpreted as model-based predictions and validated against experimental data before clinical applications.

By open-sourcing this framework, we invite the community to iterate on these models: refining muscle parameters, improving joint definitions, and validating against diverse experimental datasets. We also encourage researchers to explore future applications in rehabilitation and human–robot interaction, including training on pathological gait patterns and integration with assistive devices such as exoskeletons.

## Citation

If you find MuscleMimic useful in your research, please cite:

```bibtex
@article{li2026musclemimic,
  title={Towards Embodied AI with MuscleMimic: Unlocking full-body
         musculoskeletal motor learning at scale},
  author={Li, Chengkun and Wang, Cheryl and Ziliotto, Bianca and
          Simos, Merkourios and Durandau, Guillaume and Mathis, Alexander},
  year={2026}
}
```

<div class="highlight-box" markdown="1">

**Code, models, checkpoints, and retargeted dataset**: [github.com/amathislab/musclemimic](https://github.com/amathislab/musclemimic)

</div>
