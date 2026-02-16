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

## Abstract

Controlling a muscle-driven musculoskeletal model that is overactuated and possesses high degrees of freedom is highly complex. Previously, learning muscle-level motor control in musculoskeletal systems has been hindered by the computational cost of biomechanically accurate simulation and the scarcity of open, full-body models suitable for large-scale training. Hence, we present **MuscleMimic**, an open-source framework for scalable motion imitation learning with physiologically realistic, muscle-actuated humanoids. Leveraging massively parallel GPU simulation via MuJoCo Warp, MuscleMimic achieves order-of-magnitude training speedups while maintaining full collision handling. This efficiency transforms musculoskeletal model validation: rather than relying solely on static postures or isolated tasks, researchers can now stress-test models across diverse dynamic movements and rapidly identify biomechanical inconsistencies. The framework provides two validated embodiments: a fixed-root upper-body model for bimanual manipulation and a full-body model, alongside a retargeting pipeline that maps any SMPL format motion capture corpus onto our musculoskeletal structures while preserving kinematic and dynamic consistency. Additionally, training on this large-scale dataset yields a single generalist policy that faithfully reproduces a broad repertoire of human motions under full muscular control and can be fine-tuned for subject-specific biomechanical analysis. By publicly releasing the framework, models, checkpoints, and retargeted dataset, we strive to lower the computational and data barriers that have constrained the field, enabling wider participation in musculoskeletal motor control research.

<div class="highlight-box" markdown="1">

**Code, models, checkpoints, and retargeted dataset**: [github.com/amathislab/musclemimic](https://github.com/amathislab/musclemimic)

</div>

## Introduction

Human motor control emerges from sophisticated musculoskeletal (MSK) systems in which the brain and spinal cord coordinate hundreds of muscles to produce fluid, adaptive movements. Traditional biomechanical and human motion research commonly uses torque-driven stick models in two or three-dimensional planes with inverse dynamics or imitation learning<d-cite key="Park2004,Aftab2016,peng2018deepmimic,Won2020"></d-cite>. This approach, however, neglects the underlying neuromotor control and muscle-driven dynamics that arise from biological properties. More recently, 3D MSK models have been developed following the anatomical structure of cadavers and MRI scans and used in understanding human locomotion<d-cite key="Christophy2011,Dorn2015,Rajagoapal2016,Seth2018,Adriaenssens2022"></d-cite>. Nevertheless, these models often feature only the lower limb with simplified muscle structure (i.e., two to three muscles per joint), which fails to fully capture the dynamics of the torso, upper limb, and finger movements. **Complex full-body musculoskeletal models capable of large ranges of dynamic movement remain largely unexplored and only partially validated.** These models have the potential to offer us insights into understanding typical and impaired neuromuscular control<d-cite key="Krakauer2006"></d-cite>, generating predictive control of aging and surgical consequences<d-cite key="wang2025-ieee,Arnold2006"></d-cite>, integrating with assistive devices<d-cite key="Bregman2011,myochallenge2024,Luo2024"></d-cite>, and designing rehabilitation strategies<d-cite key="LengFengLee2006,Bulat2019"></d-cite>.

Nevertheless, computational cost has long constrained the development of validated, open-source, full-body MSK models amenable to large-scale learning due to their over-actuated nature and large degrees of freedom (DoF). Although recent advancements in reinforcement learning<d-cite key="Sutton1998"></d-cite> and imitation learning<d-cite key="peng2018deepmimic"></d-cite> have successfully reconstructed physiologically feasible motion in high DoF biomechanical systems within dynamics simulation environments (e.g., OpenSim, MyoSuite, MuJoCo, Hyfydy<d-cite key="delp2007opensim,caggiano2022myosuite,todorov2012mujoco,Geijtenbeek2021Hyfydy"></d-cite>), training usually requires days or weeks of CPU training time<d-cite key="he2024dynsyn,simos2025kinesis,wang2025-ieee"></d-cite>. This is because modern on-policy reinforcement learning demands millions of simulation steps, rendering detailed muscle-actuated models prohibitively expensive to train. Recent advances in GPU-accelerated physics engines, particularly MuJoCo Warp<d-cite key="mujoco-warp"></d-cite> and MuJoCo XLA<d-cite key="mujoco-mjx,freeman2025playground"></d-cite>, offer a path forward through massively parallel simulation to allow fast scientific iterations that were previously impossible. Such capabilities are essential for realizing neuromechanical computational models that embed neural controllers within realistic body simulations to bridge brain, body, and behavior<d-cite key="wang2026embodied"></d-cite>.

Yet a subtler challenge persists: most upper body MSK models created were only verified under static postures on moment arms, muscle force, and insertion points<d-cite key="Holzbaur2005,KleinHorsman2007,Arnold2009,Christophy2011,Engelhardt2020"></d-cite>, or centered around a single joint<d-cite key="Bassani2017,Gonalves2025"></d-cite>. Even though some lower limb models were validated against dynamic motion such as walking and running<d-cite key="Rajagoapal2016"></d-cite>, such validation is often restricted to reproducing a limited set of joint-level kinematic or kinetic measures of a specific task, leaving their fidelity under dynamic, whole-body, and diverse movement largely untested. A framework enabling fast, large-scale motion learning would not only advance motor control research but also provide the means to stress-test musculoskeletal models across a rich space of dynamic behaviours, exposing inconsistencies that static or task-specific analyses overlook<d-cite key="Almani2024,chiappa2024acquiring"></d-cite>.

**Our key contributions include:**

1. **Open-source full-body musculoskeletal models** — Two extensively validated musculoskeletal embodiments, a fixed-root upper-body model for bimanual tasks and a complete full-body system, controlled through physiologically realistic muscle activation, and integrated with imitation learning algorithms
2. **GPU-accelerated muscle simulation** — Scalable implementation using MuJoCo Warp and MJX enabling training with thousands of parallel muscle-actuated environments
3. **Improved motion retargeting pipeline** — Retargeting pipeline with SMPL shape fitting that maps AMASS motion capture data onto musculoskeletal models while respecting each model's body proportions
4. **Open dataset release** — Comprehensive dataset of retargeted AMASS motions with corresponding muscle activation patterns and kinematic data for community use
5. **Rapid finetuning capability** — Released pretrained checkpoints on hundreds of motions that practitioners can finetune to novel motions of interest within hours

## Results

### Musculoskeletal Models

MuscleMimic introduces two complementary musculoskeletal learning embodiments designed for motion learning centered on manipulation or locomotion.

| Model | Type | Joints | Muscles | DoFs | Action dim. | Focus |
|-------|------|--------|---------|------|-------------|-------|
| **BimanualMuscle** | Fixed-base | 76 (36\*) | 126 (64\*) | 54 (14\*) | 126 (64\*) | Upper-body manipulation |
| **MyoFullBody** | Free-root | 123 (83\*) | 416 (354\*) | 72 (32\*) | 416 (354\*) | Locomotion and manipulation |

<small>Both models support enabling and disabling finger muscles to facilitate faster convergence when fine finger control is not required. \* denotes configurations with finger muscles temporarily disabled. Joints denote articulated connections, while DoFs correspond to independently controllable joint coordinates.</small>

**BimanualMuscle Model.** The BimanualMuscle model is designed for upper-body manipulation tasks with a fixed thorax configuration that eliminates free root joint complexities while enabling precise bimanual coordination. Key design features include: (1) 76 joints with bilateral symmetry across both arms; (2) 126 Hill-type muscle actuators providing physiologically realistic muscle activation dynamics; (3) 7 mimic sites strategically placed for tracking upper-body motion; (4) Configurable finger control that can be disabled to manage action dimensionality. Collisions are enabled between the thorax and left and right arms, as well as between the left and right arms, to prevent self-collisions.

**MyoFullBody Model.** The MyoFullBody model provides a comprehensive musculoskeletal system for whole-body motion learning with full biomechanical fidelity and collision support. Key design features include: (1) 123 joints spanning the complete kinematic chain from pelvis to fingertips; (2) 416 Hill-type muscle actuators distributed across major muscle groups providing physiologically realistic full-body actuation; (3) 17 mimic sites covering critical body landmarks for whole-body motion tracking; (4) Comprehensive collision detection enables contact-rich interactions with the environment during locomotion and manipulation tasks by supporting both full-body–environment contact and complete self-collision among all internal collision geometries, thereby preventing self-penetration.

{% include figure.html path="assets/img/musclemimic/bimanual_model.png" alt="BimanualMuscle model" class="l-page" caption="**Figure 1.** Visualization of the BimanualMuscle model, viewed from (A) front, (B) back, and (C) side." %}

{% include figure.html path="assets/img/musclemimic/fullbody_model.png" alt="MyoFullBody model" class="l-page" caption="**Figure 2.** Visualization of the MyoFullBody model, viewed from (A) front, (B) back, and (C) side." %}

### Demo: Muscle-Driven Motion Imitation

All motions below are produced by a single generalist policy controlling **416 Hill-type muscles**.

<div class="video-grid">
  <figure>
    <video autoplay loop muted playsinline>
      <source src="/assets/videos/running.mp4" type="video/mp4">
    </video>
    <figcaption><strong>Running</strong> — Full-body locomotion with coordinated muscle actuation.</figcaption>
  </figure>
  <figure>
    <video autoplay loop muted playsinline>
      <source src="/assets/videos/airkick.mp4" type="video/mp4">
    </video>
    <figcaption><strong>Air Kick</strong> — Dynamic kicking motion with balance control.</figcaption>
  </figure>
  <figure>
    <video autoplay loop muted playsinline>
      <source src="/assets/videos/hold_leg_out.mp4" type="video/mp4">
    </video>
    <figcaption><strong>Leg Hold</strong> — Static balance demonstrating sustained muscle coordination.</figcaption>
  </figure>
  <figure>
    <video autoplay loop muted playsinline>
      <source src="/assets/videos/tennis_out.mp4" type="video/mp4">
    </video>
    <figcaption><strong>Tennis Swing</strong> — Athletic motion with full-body coordination.</figcaption>
  </figure>
</div>

Walking with corresponding synthetic muscle activation patterns:

<div class="featured-video">
  <video autoplay loop muted playsinline>
    <source src="/assets/videos/walking.mp4" type="video/mp4">
  </video>
</div>


### Imitation Learning Results

We report kinematics metrics on the KINESIS motion dataset with different checkpoints. Early termination occurs when the mean site deviation threshold across 17 mimic sites relative to the root (pelvis) is greater than 0.3 m, or if the pelvis deviates from the reference in world coordinates for more than 1 m.

| Metric | GMR-Fit (Train) | GMR-Fit (Test) |
|--------|----------------|----------------|
| Early termination rate | 0.134 | 0.166 |
| Joint position error | 0.143 | 0.143 |
| Joint velocity error | 0.568 | 0.565 |
| Root yaw error | 0.104 | 0.106 |
| Relative site position error | 0.039 | 0.040 |
| Absolute site position error | 0.252 | 0.255 |
| Mean episode length | 534.6 | 524.9 |
| Mean episode return | 610.3 | 599.3 |

<small>Validation metrics on KINESIS training (972 motions) and testing (108 motions) dataset.</small>

### Population-Based Validation

To verify the biomechanical fidelity of our model during dynamic motion, we conduct two population-based evaluations on the two most common human gaits—walking and running—against human experiment data on joint angles and moments, ground reaction forces (GRF), and electromyography (EMG) correlations, as suggested in<d-cite key="Rajagoapal2016,Hicks2015"></d-cite>.

#### Kinematics and Kinetics Analysis

**Walking.** We evaluate a pre-trained model checkpoint on 10 billion steps using the full KINESIS motion dataset, comprising five walking sequences from the AMASS dataset, each repeated three times. Simulated joint kinematics and dynamics are compared against an experimental treadmill-walking dataset as well as an experimental level walking dataset. Both datasets have a mean velocity of 1.2 m/s and are averaged across nine participants. All datasets are temporally aligned using the GRF onset and truncated to a single full gait cycle.

We found a **mean correlation index of 0.92** and **0.94**, respectively, for treadmill and level walking in kinematics, and **0.71** for joint dynamics with treadmill walking. Our simulated lower-limb joint movements exhibit a highly stereotyped pattern during walking, similar to experiment results and other literature. At initial foot contact, the hip is flexed; during the stance phase, it progressively extends, reaching a peak shortly before toe-off, and then flexes again during the swing phase. The knee is near full extension at initial contact and subsequently flexes during early stance to absorb impact, before re-extending as the body is supported. The ankle dorsiflexes as the tibia advances over the foot and then undergoes a rapid plantarflexion near the end of stance, generating propulsion at toe-off. GRF displays a characteristic double-peaked profile.

{% include figure.html path="assets/img/musclemimic/gait_walk.png" alt="Walking gait analysis" class="l-page" caption="**Figure 3.** Representative joint kinematics of the left lower limb (hip, knee, ankle, and foot) over a full walking gait cycle, comparing human experimental data and MyoFullBody-generated motion. Human walking data were collected on a treadmill at 1.2 m/s (orange) and level walking with a mean velocity of 1.2 m/s (purple). Simulated results are evaluated on five AMASS walking sequences, aligned by ground reaction force onset and truncated to one gait cycle." %}

**Running.** We evaluate the performance of MyoFullBody running by fine-tuning the 10 billion checkpoint on full KINESIS motion with an additional 50 million steps on 10 running AMASS motions. The simulated joint kinematics and dynamics are compared against an experimental treadmill-running dataset collected at a speed of 1.75 m/s, averaged across nine participants.

We report hip, knee, and ankle flexion during one gait cycle with a **mean correlation index of 0.79**. During running, the hip is flexed at initial contact and extends throughout stance, reaching peak extension near toe-off before rapidly flexing during swing to advance the limb. The knee contacts the ground in slight flexion, flexes further during early stance to absorb impact, and then extends through mid-to-late stance for support and propulsion, followed by pronounced flexion during swing for foot clearance. The ankle transitions from slight plantarflexion at contact to dorsiflexion in early stance, then generates a strong plantarflexion at push-off, providing the primary propulsive impulse.

{% include figure.html path="assets/img/musclemimic/gait_run.png" alt="Running gait analysis" class="l-page" caption="**Figure 4.** Representative joint kinematics of the left lower limb (hip, knee, ankle, and foot) over a full running gait cycle, comparing human experimental data and MyoFullBody-generated motion. Human running data were collected on a treadmill at 1.8 m/s. Simulated results aligned by ground reaction force onset and truncated to one gait cycle." %}

#### Muscle Activation Analysis (EMG)

After validating the kinematics of simulated locomotion, we evaluate the plausibility of the generated muscle activation patterns during gait cycles, through a comparison to EMG signals recorded during human walking<d-cite key="Huawei2022dataset,koo2025dataset"></d-cite>.

We plot the activation patterns of three leg muscles (Vastus Medialis, Gastrocnemius Lateralis, Soleus Medialis), normalized and averaged over gait cycles: for these specific muscles, **the synthetic muscle activations produced by the policy capture the main patterns of the human EMG signals, achieving correlation values comparable to the ones obtained through static optimization.** Results are always shown in comparison to inter-subject variability, which represents an upper bound to the desired model-human alignment. Due to the redundancy of the musculoskeletal system, it is not trivial to observe highly aligned patterns for all muscles, especially on relatively simple tasks, which the policy manages to solve while keeping some muscles almost silent.

<figure class="l-page">
  <div class="subfig-row">
    <img src="/assets/img/musclemimic/emg/Boo_with_examples.png" alt="EMG comparison — Boo et al." style="width: 62%;">
    <img src="/assets/img/musclemimic/emg/summary_metrics_Wang.png" alt="EMG summary — Wang et al." style="width: 38%;">
  </div>
  <figcaption><strong>Figure 5.</strong> <strong>(Left)</strong> Gait analysis with human data from Boo et al.<d-cite key="koo2025dataset"></d-cite> Individual muscle activation patterns and summary metrics. <strong>(Right)</strong> Summary metrics with human data from Wang et al.<d-cite key="Huawei2022dataset"></d-cite></figcaption>
</figure>


## Discussion

### On-Policy Training at Scale

A key consideration when training with massively parallel GPU simulation is balancing the inherent sample inefficiency of on-policy methods against the throughput advantages of cheap, abundant data. Let $N_{\text{env}}$ denote the number of parallel environments and $T_{\text{steps}}$ the rollout horizon per environment. Each policy update collects a batch of $B = N_{\text{env}} \times T_{\text{steps}}$ transitions. These samples are shuffled and partitioned into $N_{\text{mb}}$ minibatches, with each minibatch processed for $E$ epochs of gradient updates, yielding a total of $G = E \times N_{\text{mb}}$ gradient steps per rollout. The update-to-data (UTD) ratio, a metric commonly used in off-policy learning<d-cite key="hiraoka2021dropout,bhatt2019crossq"></d-cite>, can be adapted to the on-policy setting as:

$$\text{UTD} = \frac{G}{B} = \frac{E \times N_{\text{mb}}}{N_{\text{env}} \times T_{\text{steps}}}$$

We additionally track sample reuse $R = E$, which measures how many times each transition is revisited during training — a critical factor since excessive reuse violates the on-policy assumption and can destabilize learning.

**Single-epoch updates ($E = 1$) work best.** The combination of fast simulation and massively parallel environments unlocks a key advantage: we can use single-epoch updates, performing one gradient pass per rollout batch before collecting new data. While higher values of $E$ accelerate initial learning through more gradient updates per batch (Panel A), the high simulation throughput afforded by GPU acceleration renders this unnecessary. With $E = 1$, we achieve superior asymptotic performance (Panel B) while avoiding two pathologies that emerge with multiple update epochs: expert collapse in Soft MoE routing (Panel C), and severe distribution shift evidenced by KL divergence spikes orders of magnitude higher than the stable $E = 1$ baseline (Panel D).

{% include figure.html path="assets/img/musclemimic/epoch_ablation.png" alt="Effect of gradient epochs on training" caption="**Figure 6.** Effect of gradient epochs ($E$) on training stability. We compare $E=1$ (truly on-policy), $E=3$, and $E=10$ (aggressive sample reuse). (A) Early training (first 30M steps): higher $E$ accelerates initial learning. (B) Full training trajectory: $E=1$ achieves superior asymptotic performance. (C) KL divergence (log scale): $E>1$ exhibits catastrophic distribution shift with spikes exceeding $10^{10}$, whereas $E=1$ remains stable below $10^{-1}$." %}

**Larger batch sizes improve stability.** We observe that larger batch sizes yield higher asymptotic rewards, lower KL divergence, and smoother convergence of the learned policy standard deviation. Since larger batches require fewer gradient updates per environment step, training is also faster in wall-clock time.

{% include figure.html path="assets/img/musclemimic/batch_ablation.png" alt="Effect of batch size on training" caption="**Figure 7.** Effect of minibatch size on training dynamics. We compare minibatch sizes of $32$, $64$, and $128$. (A) Performance: larger batch sizes achieve higher asymptotic rewards. (B) Exploration stability: smaller batches cause the policy standard deviation to overshoot. (C) Policy update magnitude (log scale): larger batches yield lower KL divergence." %}

Moreover, training throughput scales directly with GPU hardware capabilities. Newer architectures such as NVIDIA H200 provide significant speedups in both simulation rollout and gradient computation compared to A100, reducing wall-clock training time proportionally.

### Muscle-Tendon Unit Modeling

MuJoCo simplifies the Hill-type model by using an inelastic tendon component in exchange for faster compilation<d-cite key="todorov2012mujoco"></d-cite>. Nevertheless, the role of the elastic tendon in everyday life and vertical jumping cannot be overlooked<d-cite key="davis2018body"></d-cite>. For example, the Achilles tendon could store and contribute up to 3 kN of forces during walking, running, and jumping<d-cite key="Kubo1999,Lai2014,Kharazi2021"></d-cite>. The performance of the vertical jump is to be increased by 8 cm with a 10% increase in the strain of the series elastic element (SEE)<d-cite key="Bobbert2001"></d-cite>. In fact, MyoFullBody is unable to complete a vertical jump without additional muscle enhancement.

## Methods

### Musculoskeletal Models

MuscleMimic provides two musculoskeletal embodiments, both built and validated upon established MyoSuite components<d-cite key="caggiano2022myosuite"></d-cite>, incorporating MyoArm, MyoLegs, and MyoBack models<d-cite key="wang2022myosim,Walia2025"></d-cite>. The muscle actuators are built as Hill-type<d-cite key="hill1938heat"></d-cite> muscle actuators following MuJoCo<d-cite key="todorov2012mujoco"></d-cite>, but with inelastic tendons and no pennation angle. Control signals are passed through a first-order nonlinear activation dynamics model to obtain muscle activations:

$$\frac{\partial}{\partial t}\text{act} = \frac{\text{ctrl} - \text{act}}{\tau(\text{ctrl}, \text{act})}$$

where $\tau(\text{ctrl}, \text{act})$ differs between activation and deactivation phases, with time constants $\tau_{\text{act}} = 0.01\text{s}$ and $\tau_{\text{deact}} = 0.04\text{s}$, following<d-cite key="Millard2013"></d-cite>. Here, $\text{ctrl}$ denotes the normalized neural excitation signal, while $\text{act}$ represents the resulting muscle activation state. We interpret $\text{act}$ as a proxy for the electromyography (EMG) envelope of the simulated musculature.

Additionally, we introduce a set of tunable parameters to allow fine-tuned adjustment of the MSK model for highly dynamic motions. Specifically, we allow the muscle activation time constant $\tau_{\text{act}}$ and the maximum active force $F_{\text{max}}$ of each muscle to be independently adjusted for the upper and lower limbs. We observe that smaller values of $\tau_{\text{act}}$ (e.g., 0.001) lead to faster activation dynamics but are associated with stiffer, less compliant motions, whereas larger values (e.g., 0.05) yield smoother control and improved performance in highly impulsive motions, such as vertical jumping. However, such values are not necessarily biologically realistic, as empirical studies suggest upper bounds on muscle activation time constants of approximately 15 ms<d-cite key="Thelen2003,Millard2013"></d-cite>.

The contact geometries of the entire body are composed of various geometric objects of either a capsule or an ellipsoid<d-cite key="mujoco2023docs"></d-cite>. Both models were fine-tuned to enforce symmetry in joint equality constraints, joint ranges, muscle moment arms, and muscle force-length (FL) curves. In addition, irregular jumps in muscle behavior were identified and corrected. The total mass of the MyoFullBody is 84.3 kg. The two limbs of BimanualMuscle weigh 9.3 kg in total.

### Motion Retargeting

**Mimic Sites.** We define a set of mimic sites on the musculoskeletal model that serve as reference points for motion retargeting and imitation learning. For MyoFullBody, 17 sites are distributed across the full body at key anatomical landmarks: head, shoulders, elbows, hands, lumbar spine, pelvis, hips, knees, ankles, and toes. For BimanualMuscle, a subset of 6 upper-limb sites captures the essential kinematics for bimanual manipulation tasks.

**Mocap-Body Retargeting.** The Mocap-Body retargeting pipeline uses mocap body, a kinematic, massless body in MuJoCo whose pose is directly prescribed and governed by physical dynamics. The motion retargeting pipeline consists of three stages: pre-processing (SMPL shape fitting), inverse kinematics (via MuJoCo), and post-processing (filtering artifacts such as floating and ground penetration).

**GMR-Fit Retargeting.** GMR<d-cite key="joao2025gmr,ze2025gmr"></d-cite> is a robotics retargeting framework aimed at providing physiologically realistic trajectories to avoid common retargeting artifacts such as foot sliding, self-penetration, frame jumping and physiologically infeasible motion. Compared to Mocap-Body retargeting, trajectories from GMR follow model-defined joint constraints and reduce sudden posture jumps between frames. We adopt the SMPL-fitting from Mocap-Body retargeting to create the **GMR-Fit** pipeline, and incorporate equality constraints and dependency between complex joints (e.g., shoulder and knees).

#### Retargeting Results

We report the retargeting results for Mocap-Body and GMR-Fit across multiple datasets:

| Metric | Mocap-Body (KINESIS) | GMR-Fit (KINESIS) |
|--------|---------------------|-------------------|
| Joint limit violation $P_{\text{joint}}$ (%) | 12.26 | **0.27** |
| Ground penetration $P_{\text{pen}}$ (%) | 0.55 | **0.24** |
| Max penetration $D^{\text{max}}_{\text{pen}}$ (m) | 0.002 | **0.001** |
| Tendon jump rate $P_{\text{tj}}$ (%) | 30.14 | **3.20** |
| RMSE (m) | 0.039 | **0.025** |
| Speed $T_{\text{frame}}$ (s) | **0.076** | 0.251 |

Overall, GMR-Fit based retargeting achieves higher joint-limit satisfaction than Mocap-Body. This is because the MuJoCo mocap body does not inherently enforce joint constraints. With respect to tendon jumping, GMR exhibits both lower maximum jump magnitudes and a smaller fraction of affected motions. Mocap-Body retains a substantial computational advantage, with retargeting timescales approximately three times faster than GMR.

### Motion Imitation Training

**Implementation.** We implemented MuscleMimic as a JAX-based framework extending LocoMuJoCo<d-cite key="al2023locomujoco"></d-cite> with three major additions: customized retargeting pipeline with additional support to GMR and more motion captured datasets, native MuJoCo Warp support for GPU-accelerated simulation with flexible collision support, and extensive redesign for musculoskeletal systems. An optional MJX backend is available for reduced contact configurations.

**Early Termination.** We employ early termination based on relative position error to prevent the policy from exploring highly unrealistic configurations. If any site exceeds a threshold of $\delta = 0.3\,\text{m}$, the episode terminates immediately. Crucially, we use relative rather than absolute world-frame position error because we do not assume that the agent's root location can precisely track the motion capture reference. Muscle activation dynamics introduce temporal delays, and physiological constraints may prevent the musculoskeletal model from achieving the exact velocities and accelerations present in the reference data.

**Observation Space.** Both policies receive observations comprising three components: proprioceptive state (joint positions and velocities), muscle state (neural excitation $u$, muscle-tendon unit length $l$, contraction velocity $\dot{l}$, and force $F$), and goal specification (target joint configurations with 1-step lookahead, together with current and target site positions, orientations, and velocities in the local reference frame).

**Reward Formulation.** We employ a DeepMimic-like reward<d-cite key="peng2018deepmimic"></d-cite>:

$$r_t = \max\{0,\; r_t^{\text{imit}} + P_t\}$$

The imitation term combines joint-space and site-based objectives:

$$r_t^{\text{imit}} = w_q r_q + w_{\dot{q}} r_{\dot{q}} + w_p r_p + w_\theta r_\theta + w_v r_v^\omega + w_v r_v^v$$

Task-space rewards measure relative site positions and orientations:

$$r_p = \exp\!\left(-\beta_p \cdot \frac{1}{K-1}\sum_{i=1}^{K-1} \|\mathbf{p}^{\text{rel}}_i - \mathbf{p}^{*,\text{rel}}_i\|^2\right)$$

where

$$\mathbf{p}^{\text{rel}}_i = \mathbf{p}_i - \mathbf{p}_{s_0}$$

$K$ is the number of mimic sites and $s_0$ is the pelvis reference site. The penalty term comprises a clipped sum of regularizers including action bounds violation, action rate, and muscle activation energy.

**Policy Architecture.** We use an actor-critic architecture with separate policy and value networks. Both are multi-layer perceptrons with SiLU activations<d-cite key="elfwing2018sigmoid"></d-cite> and optional LayerNorm<d-cite key="ba2016layer"></d-cite> between hidden layers, initialized with orthogonal weights<d-cite key="saxe2014exact"></d-cite>. The policy $\pi_\phi$ outputs a diagonal Gaussian distribution:

$$\pi_\phi(\mathbf{a} | \mathbf{o}) = \mathcal{N}\big(\boldsymbol{\mu}_\phi(\mathbf{o}), \text{diag}(\boldsymbol{\sigma}^2)\big)$$

**Motion Imitation Datasets.** For MyoFullBody training, we use motion trajectories from the **KINESIS** dataset<d-cite key="simos2025kinesis"></d-cite>, a curated subset of the AMASS<d-cite key="mahmood2019amass"></d-cite> corpus consisting of high-quality, full-body motions with standardized movement patterns — including walking, turning, and running. We progressively scale the training dataset by incrementally increasing the number, diversity, and difficulty of motions, including highly dynamic behaviours such as jumping, punching, and kicking, as well as large-scale motion capture datasets such as Embody3D<d-cite key="embody3d"></d-cite>.

**Optimizer.** We use the Muon optimizer<d-cite key="jordan2024muon"></d-cite> for 2D weights (Linear layers) and Adam<d-cite key="DBLP:journals/corr/KingmaB14"></d-cite> for 1D weights (biases and layernorm) and observe that it learns significantly faster and yields higher rewards compared to AdamW. This aligns with recent findings that Muon's weight-decay-based update scaling improves convergence and performance<d-cite key="liu2025muon"></d-cite>.

## Limitations

While our framework demonstrates promising alignment with experimental data in population-based and trial-based validations, musculoskeletal models remain approximations of biological reality. The Hill-type muscle model, though widely adopted, simplifies complex phenomena such as history-dependent force production, heterogeneous fiber recruitment, and tendon elasticity. Joint constraints and contact geometries are idealized representations that may not capture the full complexity of human articulations. Furthermore, the SMPL-based motion retargeting assumes a generic body morphology, potentially introducing systematic biases when applied to individuals with atypical anthropometrics.

By open-sourcing this framework, we hope to enable the broader research community to iterate on these models — refining muscle parameters, improving joint definitions, and validating against diverse experimental datasets. Simulation outputs should be interpreted as model predictions rather than ground truth, and conclusions drawn from simulated muscle activations or joint loads warrant validation against independent experimental measurements before clinical application.

## Appendix

### A. Muscle Validation

#### A.1 Muscle Symmetry

Both **BimanualMuscle** and **MyoFullBody** are fine-tuned to be perfectly symmetric in terms of joint equality constraint, joint ranges, muscle moment arm and muscle force-length (FL) curves.

<figure class="l-page">
  <div class="image-grid-2">
    <img src="/assets/img/refinement1.svg" alt="Muscle symmetry — BFLH across Knee Flexion">
    <img src="/assets/img/refinement2.svg" alt="Muscle symmetry — BIClong across Elbow Flexion">
  </div>
  <figcaption><strong>Figure 8.</strong> Validation of symmetry between left and right muscle-tendon groups of MyoFullBody.</figcaption>
</figure>

#### A.2 Muscle Jump Refinement

As part of building the BimanualMuscle model and refining MyoFullBody, each muscle-tendon moment arm was cross-validated against its target joint to ensure continuity and the absence of sudden jumps. Whenever discontinuities were observed, the corresponding wrapping geometry was manually corrected and fine-tuned to achieve smooth and consistent moment-arm and force-generating profiles. Most refinement of muscle routes concentrated around the shoulder joint, in which multiple joint equality constraints are enforced. A few asymmetries in the muscle actuator properties and knee equality constraints were identified within the lower limb and cross-matched. **In total, around 150 asymmetries and muscle jumps were fixed** in the final version compared to the previous myoArm and myoLegs.

#### A.3 Muscle Validation with Experimental Data

The biofidelity of the MyoFullBody and BimanualModel was validated by comparing the moment arms of each muscle calculated in the model with those measured on human subjects, either from cadaver or MRI<d-cite key="Delp1990SurgerySimulation,Visser1990,Spoor1992,Herzog1993LinesOfAction,Hintermann1994,Pigeon1996,Wretenberg1996,Klein1996,Aper1996,Buford1997,Kellis1999,Arnold2000,Buford2001,PIAZZA2003,Ackland2008,Wilson2009,Sobczak2013,Fiorentino2013,Snoeck2021,Wang2021,Chen2025"></d-cite>. A muscle's moment arm characterizes the mapping between muscle force and the resulting joint moment. For a given muscle $m$ acting about joint $j$, the magnitude of the moment arm $\lvert r_{j,m}\rvert$ is computed as:

$$\lvert r_{j,m}\rvert = \frac{\Delta l_{\text{MTC},m}}{\Delta \theta_j}$$

where $\Delta l_{\text{MTC},m}$ denotes a small change in the muscle-tendon complex (MTC) length, and $\Delta \theta_j$ denotes the corresponding change in the joint angle<d-cite key="ATSUMI2025"></d-cite>. Given the known variability in experimentally reported moment arms arising from differences in measurement methodologies and inter-individual anatomical variation, our simulated moment arms are evaluated with respect to the overall range of reported experimental values. Within this context, the simulation results are generally consistent with the experimentally observed ranges.

<figure class="l-page">
  <div class="image-grid-2">
    <img src="/assets/img/musclemimic/muscle_check/moment_arm_BRD.png" alt="BRD moment arm validation">
    <img src="/assets/img/musclemimic/muscle_check/moment_arm_Biceps femoris.png" alt="Biceps femoris moment arm validation">
  </div>
  <div class="image-grid-2">
    <img src="/assets/img/musclemimic/muscle_check/superior_lat_dorsi_abduction_validation.png" alt="Lat dorsi moment arm validation">
    <img src="/assets/img/musclemimic/muscle_check/moment_arm_Rectus femoris.png" alt="Rectus femoris moment arm validation">
  </div>
  <figcaption><strong>Figure 9.</strong> Validation comparing MyoFullBody muscle moment arms against experimental data from prior studies for selected shoulder, elbow, and lower-limb muscles. Despite inter-individual variability, our model's profiles remain within the reported experimental ranges.</figcaption>
</figure>

### B. Musculoskeletal Model Parameters

The MyoFullBody model declares 123 joints, consisting of one free joint, 112 hinge joints, and 10 slide joints; 51 equality constraints enforce anatomical couplings, resulting in 72 independent degrees of freedom. The BimanualMuscle model declares 76 hinge joints with 22 equality constraints, yielding 54 independent degrees of freedom.

| Body Segment | MyoFullBody (kg) | MyoFullBody (%) | Winter et al. 2009<d-cite key="Winter2009"></d-cite> (%) |
|-------------|-----------------|----------------|----------------------|
| Head (& Neck) | 2.4 | 3.1 | 8.1 |
| Thorax | 18.6 | 24.1 | 21.6 |
| Abdomen / Lumbar | 9.2 | 11.9 | 13.9 |
| Pelvis | 11.0 | 14.2 | 14.2 |
| Arms (Both) | 9.3 | 12.0 | 10.0 |
| Legs (Both) | 26.9 | 34.8 | 32.2 |

### C. Validation Metrics

All metrics are computed by comparing simulated trajectories against the reference motion after applying the same root-frame alignment used during training.

- **Early termination rate** — The fraction of evaluation episodes that terminate prematurely
- **Joint position error** — The RMS error between simulated and reference joint positions, excluding the root joint
- **Joint velocity error** — The RMS error between simulated and reference joint velocities
- **Root position error** — The RMS Euclidean distance between simulated and reference root positions in world coordinates
- **Root yaw error** — The absolute angular difference between simulated and reference root yaw angles
- **Relative site position error** — The RMS error between simulated and reference site positions expressed relative to the root body
- **Absolute site position error** — The mean Euclidean distance between simulated and reference site positions in world coordinates
- **Mean episode length** — The average number of simulation steps completed per evaluation episode before termination
- **Mean episode return** — The average cumulative reward per evaluation episode

<div class="highlight-box" markdown="1">

**Code, models, checkpoints, and retargeted dataset**: [github.com/amathislab/musclemimic](https://github.com/amathislab/musclemimic)

</div>
