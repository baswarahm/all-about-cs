/* ============ bank.js — big Test 1 question bank + generators + random papers ============
   Written from the Topic 1–3 slides and the three tutorials, in the style of the past Test 1
   (50 single-answer MCQs with 4 options; about 18 on Topic 1, 14 on Topic 2, 18 on Topic 3).
   BANK: fixed concept questions, same format as tests.js { t, q, o, a, e }.
   GEN:  generators for the calculation questions; every call makes a new question and works out the answer itself.
   DYNAMIC: papers that are built fresh for every attempt (random Test 1, and one practice set per topic). */

const BANK = [
  /* ───────── Topic 1 · architecture vs organisation ───────── */
  { t: 1, q: 'Computer organisation deals with:', o: ['The structural relationships and operational units that realise the architecture', 'Only the instruction set seen by the programmer', 'The programming language used', 'The price of the computer'], a: 0, e: 'Organisation = operational units and their interconnections that achieve the architectural specification (the <b>how</b>).' },
  { t: 1, q: 'Which of the following is an <b>organisational</b> attribute?', o: ['Control signals and memory technology', 'The instruction set', 'Number of bits used to represent data types', 'Addressing techniques'], a: 0, e: 'Instruction set, data-type bits, I/O mechanisms and addressing are architectural (visible to the programmer). Control signals, interfaces and memory technology are organisational.' },
  { t: 1, q: '"Is there a hardware multiply unit, or is multiplication done by repeated addition?" This is a question of:', o: ['Organisation', 'Architecture', 'Cloud computing', 'Benchmarking'], a: 0, e: 'Whether there is a multiply instruction is architecture; <b>how</b> it is implemented is organisation.' },
  { t: 1, q: 'Computer architecture is the realisation of what a computer system does, while organisation is about:', o: ['How it does it', 'Why it does it', 'Who uses it', 'When it was built'], a: 0, e: 'Architecture = what; organisation = how.' },
  { t: 1, q: 'Manufacturers produce a family of computer models that have:', o: ['The same architecture but different organisations', 'Different architectures but the same organisation', 'The same price and performance', 'No compatibility between models'], a: 0, e: 'Same architecture, different organisation → different price and performance.' },
  { t: 1, q: 'The main benefit of the processor family concept is:', o: ['Code compatibility between models', 'Every model has the same speed', 'No need for an operating system', 'Lower power for every model'], a: 0, e: 'The same basic instruction set means programs run on every model (backward compatibility).' },
  { t: 1, q: 'In a processor family, which of these can change without breaking program compatibility?', o: ['Number of cores and cache size', 'The basic instruction set', 'Programmer-visible features', 'The meaning of existing instructions'], a: 0, e: 'Organisation can change (more cores, larger cache, better pipelines, newer memory); the architecture stays compatible.' },
  { t: 1, q: 'Describing a computer by starting at the bottom and building up to a complete description is the:', o: ['Bottom-up approach', 'Top-down approach', 'Stored-program approach', 'Family concept'], a: 0, e: 'Bottom-up builds up from the bottom; top-down (preferred in the slides) starts with major components.' },
  { t: 1, q: 'According to the slides, it is clearer to describe a computer system using:', o: ['A top-down approach', 'A bottom-up approach', 'Only a list of chips', 'Machine language'], a: 0, e: 'Start with the major components (structure and function), then go to the lower layers.' },
  /* structure & function */
  { t: 1, q: 'All computer functions are:', o: ['Data processing, data storage, data movement and control', 'Input, output, printing and saving', 'Fetch, decode, execute and store', 'Compile, link, load and run'], a: 0, e: 'The four basic functions.' },
  { t: 1, q: 'Moving data between the computer and a device connected to it (e.g. keyboard, screen) is the function of:', o: ['Data movement', 'Data storage', 'Control', 'Data processing'], a: 0, e: 'Data movement: from/to I/O or communication lines.' },
  { t: 1, q: 'The unit that controls and synchronises the processing, storage and movement functions provides the function of:', o: ['Control', 'Data storage', 'Data movement', 'Benchmarking'], a: 0, e: 'Control co-ordinates the other three functions.' },
  { t: 1, q: 'Which top-level component moves data between the computer and its external environment?', o: ['I/O', 'Main memory', 'System interconnection', 'Control unit'], a: 0, e: 'I/O moves data between the computer and its external environment.' },
  { t: 1, q: 'Which top-level component stores data?', o: ['Main memory', 'I/O', 'System interconnection', 'ALU'], a: 0, e: 'Main memory stores data.' },
  { t: 1, q: 'The CPU (processor):', o: ['Controls the operation of the computer and performs its data processing', 'Only stores data permanently', 'Only connects peripherals', 'Moves data to the printer only'], a: 0, e: 'CPU = control + data processing.' },
  { t: 1, q: 'Which is NOT a structural component of the control unit?', o: ['Main memory', 'Sequencing logic', 'Control unit registers and decoders', 'Control memory'], a: 0, e: 'CU = sequencing logic, CU registers and decoders, control memory.' },
  { t: 1, q: 'At the top level, which list gives the four main structural components of a computer?', o: ['CPU, main memory, I/O, system interconnection', 'ALU, registers, CU, internal bus', 'Keyboard, mouse, monitor, printer', 'Gates, memory cells, wafers, chips'], a: 0, e: 'Top level: CPU, main memory, I/O, system interconnection. The second list is the CPU\'s own components.' },
  { t: 1, q: 'Going "down" one level from the computer, the CPU is made of:', o: ['ALU, registers, control unit and internal CPU interconnection', 'Main memory, I/O and system bus', 'Hard disk, RAM and power supply', 'Monitor, keyboard and mouse'], a: 0, e: 'CPU structure: ALU, registers, CU, internal CPU interconnection.' },
  { t: 1, q: 'When several processors all reside on a single chip, the computer is called a:', o: ['Multicore computer', 'Minicomputer', 'Mainframe', 'Embedded computer'], a: 0, e: 'Multiple processing units on one chip = multicore.' },
  { t: 1, q: 'A processor that contains multiple cores is referred to as a:', o: ['Multicore processor', 'Microcontroller', 'Single-core processor', 'Coprocessor'], a: 0, e: 'Processor: one or more cores; multicore if it has multiple.' },
  { t: 1, q: 'The term "CPU" is used for the processor in a system that has:', o: ['A single processing unit', 'Many cores', 'No memory', 'Only I/O devices'], a: 0, e: 'CPU: fetches and executes instructions; referred to as a processor in a system with a single processing unit.' },
  /* history: first generation */
  { t: 1, q: 'The vacuum tube was invented in:', o: ['1906', '1947', '1964', '1971'], a: 0, e: '1906. The transistor came in 1947.' },
  { t: 1, q: 'Which is a characteristic of first-generation (vacuum tube) computers?', o: ['They depended on machine language and could not multitask', 'They used integrated circuits', 'They were small and cheap to run', 'They ran high-level languages easily'], a: 0, e: 'Vacuum tubes: lots of heat, costly, machine language, no multitasking.' },
  { t: 1, q: 'ENIAC stands for:', o: ['Electronic Numerical Integrator And Computer', 'Electronic Network Integrated Automatic Computer', 'Engineering Numerical Instruction And Control', 'Electronic Numeric Interface And Calculator'], a: 0, e: 'Electronic Numerical Integrator And Computer.' },
  { t: 1, q: 'ENIAC was built at:', o: ['The University of Pennsylvania', 'Princeton Institute for Advanced Study', 'Bell Labs', 'IBM'], a: 0, e: 'By Eckert and Mauchly at the University of Pennsylvania.' },
  { t: 1, q: 'ENIAC was started in 1943 and finished in 1946. As a result:', o: ['It was too late for the war effort', 'It was used for the moon landing', 'It replaced the IBM 360', 'It was the first minicomputer'], a: 0, e: 'Too late for WWII; its first task was hydrogen-bomb calculations.' },
  { t: 1, q: 'ENIAC remained in use until:', o: ['1955', '1946', '1964', '1971'], a: 0, e: 'Used until 1955.' },
  { t: 1, q: 'ENIAC occupied about:', o: ['15,000 square feet', '150 square feet', '1,500 square feet', '150,000 square feet'], a: 0, e: '18,000 vacuum tubes, 15,000 square feet.' },
  { t: 1, q: 'ENIAC is described in the slides as the first:', o: ['Programmable general-purpose electronic digital computer', 'Stored-program computer', 'Commercial computer', 'Microprocessor'], a: 0, e: 'Stored-program = IAS; commercial = UNIVAC I; microprocessor = Intel 4004.' },
  /* IAS */
  { t: 1, q: 'The IAS computer was designed at:', o: ['Princeton Institute for Advanced Study', 'University of Pennsylvania', 'Bell Labs', 'Cambridge, England'], a: 0, e: 'IAS = Institute for Advanced Study, Princeton (von Neumann, Goldstine, Oppenheimer).' },
  { t: 1, q: 'The IAS computer was started in ______ and completed in ______.', o: ['1946 / 1952', '1943 / 1946', '1947 / 1950', '1964 / 1971'], a: 0, e: 'Started 1946, completed 1952. It is the prototype of present computers.' },
  { t: 1, q: 'The IAS memory consists of:', o: ['1000 × 40-bit words', '4096 × 8-bit words', '1000 × 20-bit words', '64 KB'], a: 0, e: '1000 words of 40 bits; each word holds a number or two 20-bit instructions.' },
  { t: 1, q: 'In the IAS computer, each instruction is:', o: ['20 bits long', '40 bits long', '8 bits long', '16 bits long'], a: 0, e: 'Two 20-bit instructions fit in one 40-bit word.' },
  { t: 1, q: 'Which IAS register holds the address of the memory word to be read or written?', o: ['Memory Address Register (MAR)', 'Memory Buffer Register (MBR)', 'Program Counter (PC)', 'Accumulator (AC)'], a: 0, e: 'MAR = address; MBR = data; PC = address of the next instruction.' },
  { t: 1, q: 'Which IAS register holds a data word to be stored in or received from memory?', o: ['Memory Buffer Register (MBR)', 'Memory Address Register (MAR)', 'Instruction Register (IR)', 'Program Counter (PC)'], a: 0, e: 'MBR holds data.' },
  { t: 1, q: 'Which IAS register temporarily holds the right-hand instruction of a word?', o: ['Instruction Buffer Register (IBR)', 'Instruction Register (IR)', 'Multiplier Quotient (MQ)', 'Memory Address Register (MAR)'], a: 0, e: 'IBR = temporary instructions.' },
  { t: 1, q: 'In the IAS computer, the control unit:', o: ['Fetches instructions from memory and executes them one at a time', 'Executes all instructions in parallel', 'Stores the program permanently', 'Only performs arithmetic'], a: 0, e: 'One instruction at a time.' },
  /* commercial computers, IBM */
  { t: 1, q: 'UNIVAC stands for:', o: ['Universal Automatic Computer', 'Universal Vacuum Computer', 'United Automatic Calculator', 'Universal Analog Computer'], a: 0, e: 'UNIVAC I = Universal Automatic Computer (Eckert-Mauchly Computer Corporation, 1947).' },
  { t: 1, q: 'The Eckert-Mauchly Computer Corporation later became part of:', o: ['Sperry-Rand Corporation', 'IBM', 'Intel', 'DEC'], a: 0, e: 'It became part of Sperry-Rand.' },
  { t: 1, q: 'The UNIVAC 1100 series was mainly used for:', o: ['Scientific applications', 'Video games', 'Mobile phones', 'Embedded systems'], a: 0, e: 'UNIVAC 1100 series: scientific applications.' },
  { t: 1, q: 'Before building computers, IBM was a major manufacturer of:', o: ['Punched-card processing equipment', 'Vacuum tubes', 'Transistors', 'Microprocessors'], a: 0, e: 'IBM made punched-card processing equipment.' },
  { t: 1, q: 'The IBM 702 (1955) was designed for:', o: ['Business applications', 'Scientific calculations', 'Artillery tables', 'Embedded systems'], a: 0, e: '701 (1953) = scientific; 702 (1955) = business. Together they led to the 700/7000 series.' },
  /* second generation */
  { t: 1, q: 'The transistor was invented in 1947 at:', o: ['Bell Labs', 'IBM', 'Intel', 'Princeton'], a: 0, e: 'By William Shockley et al. at Bell Labs.' },
  { t: 1, q: 'Compared with vacuum tubes, transistors are:', o: ['Smaller, cheaper and dissipate less heat', 'Larger and more expensive', 'Hotter but faster', 'Made of glass'], a: 0, e: 'Solid-state devices made from silicon (sand).' },
  { t: 1, q: 'Transistors are solid-state devices made from:', o: ['Silicon', 'Copper', 'Glass', 'Iron'], a: 0, e: 'Silicon (sand).' },
  { t: 1, q: 'Second-generation (transistor) computers introduced:', o: ['High-level programming languages and system software', 'Integrated circuits', 'Microprocessors', 'Cloud computing'], a: 0, e: 'Plus more complex ALUs and control units, better performance and larger memory.' },
  { t: 1, q: 'Which company produced the PDP-1?', o: ['DEC', 'IBM', 'Intel', 'NCR'], a: 0, e: 'DEC (founded 1957) produced the PDP-1.' },
  { t: 1, q: 'The main problem with second-generation computers was that transistors were:', o: ['Discrete (separate) components, hard to manage in large numbers', 'Too hot to use', 'Made of vacuum tubes', 'Unable to store data'], a: 0, e: 'Tens and hundreds of separate components → led to integrated circuits.' },
  /* third generation */
  { t: 1, q: 'In an integrated circuit, Boolean (logical) functions are implemented by:', o: ['Gates', 'Memory cells', 'Wafers', 'Registers only'], a: 0, e: 'Gates = data processing; memory cells = data storage; interconnections = data movement and control.' },
  { t: 1, q: 'Each memory cell in an integrated circuit stores:', o: ['1 bit of data', '1 byte of data', 'One instruction', 'One word of 40 bits'], a: 0, e: 'One bit each.' },
  { t: 1, q: 'The correct relationship from largest to smallest is:', o: ['Wafer → chip → gate', 'Chip → wafer → gate', 'Gate → chip → wafer', 'Wafer → gate → chip'], a: 0, e: 'A silicon wafer is cut into chips; each chip contains many gates.' },
  /* Moore's law */
  { t: 1, q: "Moore's Law was stated by Gordon Moore, a co-founder of:", o: ['Intel', 'IBM', 'ARM', 'AMD'], a: 0, e: 'Gordon Moore co-founded Intel.' },
  { t: 1, q: "Moore originally predicted that the number of transistors on a chip would double every:", o: ['Year', 'Month', '10 years', '5 years'], a: 0, e: 'Every year at first; since the 1970s, about every 18 months.' },
  { t: 1, q: "Which is a consequence of Moore's Law?", o: ['Shorter electrical paths, giving higher performance', 'The cost of a chip doubles every year', 'Computers need more cooling', 'More interconnections reduce reliability'], a: 0, e: 'Also: cost of a chip almost unchanged, smaller size, reduced power and cooling, fewer interconnections → more reliable.' },
  { t: 1, q: "According to Moore's Law, the cost of a chip has:", o: ['Remained almost unchanged', 'Doubled every year', 'Halved every month', 'Increased with every transistor'], a: 0, e: 'Cost of a chip has remained almost unchanged.' },
  /* IBM 360, PDP-8 */
  { t: 1, q: 'The IBM 360 series was introduced in:', o: ['1964', '1946', '1971', '1985'], a: 0, e: '1964.' },
  { t: 1, q: 'The IBM 360 replaced the 7000 series and was:', o: ['Not compatible with it', 'Fully compatible with it', 'A minicomputer', 'A microprocessor'], a: 0, e: 'Replaced (and not compatible with) the 7000 series.' },
  { t: 1, q: 'Within the IBM 360 family, moving to a bigger model gave:', o: ['Increasing speed, memory, I/O ports and cost', 'A different instruction set', 'A different operating system with no compatibility', 'Lower cost and lower speed'], a: 0, e: 'Similar/identical instruction set and OS; speed, I/O ports, memory size and cost increase.' },
  { t: 1, q: 'The IBM 360 used which interconnection structure?', o: ['Multiplexed-switch (central-switched)', 'Bus structure', 'Wireless', 'Cloud'], a: 0, e: 'PDP-8 used a bus structure.' },
  { t: 1, q: 'The DEC PDP-8 (1964) was the first:', o: ['Minicomputer', 'Mainframe', 'Microprocessor', 'Stored-program computer'], a: 0, e: 'Small enough for a lab bench; no air-conditioned room needed.' },
  { t: 1, q: 'The PDP-8 cost about ______, compared with $100k+ for an IBM 360.', o: ['$16,000', '$1,600', '$160,000', '$1,000,000'], a: 0, e: '$16,000.' },
  { t: 1, q: 'The PDP-8 introduced which interconnection structure?', o: ['Bus structure', 'Multiplexed switch', 'Crossbar', 'Point-to-point fibre'], a: 0, e: 'Bus structure; also used in embedded/OEM systems.' },
  { t: 1, q: 'OEM use of the PDP-8 means:', o: ['Another manufacturer integrates it into a total system for resale', 'It was only used by the original buyer', 'It ran cloud services', 'It had no memory'], a: 0, e: 'Original Equipment Manufacturer.' },
  /* semiconductor memory, microprocessors */
  { t: 1, q: 'Before semiconductor memory, main memory was made of ferromagnetic cores, which were:', o: ['Expensive, bulky and had destructive readout', 'Cheap and tiny', 'Non-volatile and fast', 'Made on silicon wafers'], a: 0, e: 'Core memory: expensive, bulky, destructive readout.' },
  { t: 1, q: 'In 1970, Fairchild introduced a semiconductor memory chip about the size of a single core that held:', o: ['256 bits', '256 bytes', '1 KB', '64 KB'], a: 0, e: '256 bits, non-destructive read, much faster than core.' },
  { t: 1, q: 'The Intel 4004 (1971) was a ______ microprocessor.', o: ['4-bit', '8-bit', '16-bit', '32-bit'], a: 0, e: 'First microprocessor, 4-bit, all CPU components on one chip.' },
  { t: 1, q: 'The Intel 8008 (1972) was:', o: ['8-bit, designed for specific applications', '16-bit, general purpose', '4-bit, general purpose', '32-bit'], a: 0, e: '4004 and 8008 were for specific applications; the 8080 (1974) was the first general-purpose one.' },
  { t: 1, q: 'Powerful, general-purpose 16-bit microprocessors such as the 8086 appeared:', o: ['At the end of the 1970s', 'In 1946', 'In 1964', 'In 2006'], a: 0, e: 'End of the 1970s.' },
  { t: 1, q: 'In 1981, which companies introduced a 32-bit single-chip processor?', o: ['Bell Labs and Hewlett-Packard', 'IBM and DEC', 'Intel and AMD', 'ARM and Apple'], a: 0, e: '1981: Bell Labs & HP; 1985: Intel 80386.' },
  /* x86, ARM */
  { t: 1, q: 'The addressable memory of the Intel 8086 was:', o: ['1 MB', '64 KB', '640 bytes', '4 GB'], a: 0, e: 'From the x86 table: 8086, 1978, 16-bit, 29,000 transistors, 1 MB.' },
  { t: 1, q: 'The x86 instruction set has about ______ instructions, with roughly one added per month.', o: ['500', '50', '5,000', '50,000'], a: 0, e: '~500 instructions, ~1 instruction per month added.' },
  { t: 1, q: 'Any program written for an older x86 processor can run on a newer one because the ISA is:', o: ['Backward compatible', 'Rewritten every year', 'Based on ARM', 'Stored in the cloud'], a: 0, e: 'The organisation changed dramatically; the ISA evolved with backward compatibility.' },
  { t: 1, q: 'The x86 architecture is dominant:', o: ['Outside embedded systems', 'Only in embedded systems', 'Only in mobile phones', 'Only in supercomputers'], a: 0, e: 'ARM dominates embedded systems.' },
  { t: 1, q: 'ARM evolved from which design approach?', o: ['RISC', 'CISC', 'Vacuum tube', 'Core memory'], a: 0, e: 'ARM evolved from RISC design.' },
  { t: 1, q: 'An embedded system is:', o: ['Used within a product for a dedicated function, not as a general-purpose computer', 'A large mainframe', 'A cloud service', 'A type of benchmark'], a: 0, e: 'E.g. anti-lock brakes, household appliances, airbags.' },
  { t: 1, q: 'Which is an example of an embedded system?', o: ['Anti-lock brakes in a car', 'A web server farm', 'A desktop PC', 'Google Apps'], a: 0, e: 'Dedicated function inside a product.' },
  { t: 1, q: 'The Internet of Things (IoT) is mainly driven by:', o: ['Deeply embedded devices', 'Mainframes', 'Vacuum tubes', 'Punched cards'], a: 0, e: 'Expanding interconnection of smart devices, from appliances to tiny sensors.' },
  { t: 1, q: 'ARM processors are designed by ARM Inc. (Cambridge, England) and then:', o: ['Licensed to manufacturers', 'Only sold by ARM', 'Used only by IBM', 'Given away with Windows'], a: 0, e: 'Licensed; known for high speed, small die size and low power consumption.' },
  { t: 1, q: 'ARM Ltd. was founded by:', o: ['Acorn, VLSI and Apple Computer', 'Intel and AMD', 'IBM and DEC', 'Bell Labs and HP'], a: 0, e: 'Acorn produced ARM1/ARM2 (1985) and ARM3 (1989).' },
  { t: 1, q: 'The ARM Cortex-M family is aimed at:', o: ['Microcontrollers', 'Supercomputers', 'Mainframes', 'Cloud servers'], a: 0, e: 'Cortex-A = application, Cortex-R = real-time, Cortex-M = microcontroller.' },
  { t: 1, q: "Apple's A-series chip is a system-on-a-chip (SoC). Which part does on-device AI/ML?", o: ['Neural Engine', 'GPU', 'Image processor', 'Memory controller'], a: 0, e: 'SoC: CPU, GPU, Neural Engine, image/video processors, memory & controllers.' },
  /* cloud */
  { t: 1, q: 'NIST describes cloud computing as a model for:', o: ['Ubiquitous, convenient, on-demand network access to a shared pool of configurable computing resources', 'Building faster vacuum tubes', 'Measuring CPU speed', 'Designing instruction sets'], a: 0, e: 'NIST definition.' },
  { t: 1, q: 'Google Apps, Microsoft Office 365 and Dropbox are examples of:', o: ['SaaS', 'PaaS', 'IaaS', 'DaaS'], a: 0, e: 'Application software running in the cloud = SaaS.' },
  { t: 1, q: 'Windows Azure and Google App Engine, which give tools to build and deploy applications, are examples of:', o: ['PaaS', 'SaaS', 'IaaS', 'DaaS'], a: 0, e: 'Platform as a Service.' },
  { t: 1, q: 'Access to processing, storage and networks (e.g. Amazon Web Services, Google Compute Engine) is:', o: ['IaaS', 'SaaS', 'PaaS', 'DaaS'], a: 0, e: 'Infrastructure as a Service.' },
  /* performance */
  { t: 1, q: 'Which is NOT one of the key parameters for assessing a computer listed in the slides?', o: ['Colour of the case', 'Performance', 'Power consumption', 'Reliability'], a: 0, e: 'Performance, cost, size, security, reliability, power consumption.' },
  { t: 1, q: 'The time between two clock pulses is called the:', o: ['Cycle time', 'Clock rate', 'CPI', 'MIPS rate'], a: 0, e: 'One increment = clock cycle; time between pulses = cycle time = 1/f.' },
  { t: 1, q: 'If the clock rate is f, the cycle time τ is:', o: ['1 / f', 'f × 2', 'f / 2', 'f²'], a: 0, e: 'τ = 1/f.' },
  { t: 1, q: '1 GHz equals:', o: ['10⁹ Hz', '10⁶ Hz', '10³ Hz', '10¹² Hz'], a: 0, e: 'MHz = 10⁶ Hz, GHz = 10⁹ Hz.' },
  { t: 1, q: 'CPI means:', o: ['Cycles per instruction', 'Clocks per interrupt', 'Characters per inch', 'Cores per instruction'], a: 0, e: 'Average number of clock cycles an instruction takes.' },
  { t: 1, q: 'MIPS stands for:', o: ['Millions of instructions per second', 'Memory instructions per second', 'Machine instruction processing speed', 'Multiple instruction parallel system'], a: 0, e: 'MIPS rate = f / (CPI × 10⁶).' },
  { t: 1, q: 'The MIPS rate can be calculated as:', o: ['f / (CPI × 10⁶)', 'CPI × f', 'Ic × CPI', '10⁶ / f'], a: 0, e: 'Instructions per second ÷ 10⁶.' },
  { t: 1, q: 'The average CPI of a program depends on:', o: ['How many instructions of each type the program executes', 'Only the clock rate', 'Only the screen size', 'The colour depth'], a: 0, e: 'Instruction mix: weighted average of the CPI of each instruction type.' },
  { t: 1, q: 'Programs designed to test performance are called:', o: ['Benchmarks', 'Compilers', 'Drivers', 'Firmware'], a: 0, e: 'Benchmarks.' },
  { t: 1, q: 'A good benchmark program is:', o: ['Written in a high-level language, easily measured and widely distributed', 'Written only in machine code', 'Kept secret', 'Different on every run'], a: 0, e: 'Also represents a style of task (systems, numerical, commercial).' },
  { t: 1, q: 'SPEC stands for:', o: ['System Performance Evaluation Corporation', 'Standard Processor Execution Code', 'Speed and Power Evaluation Council', 'System Program Execution Count'], a: 0, e: 'System Performance Evaluation Corporation.' },
  { t: 1, q: 'Which SPEC suite measures 3D graphics performance?', o: ['SPECviewperf', 'SPECjbb2015', 'SPECsfs2014', 'SPEC CPU2017'], a: 0, e: 'viewperf = 3D graphics; jbb = server-side Java; sfs = file servers; CPU2017 = processor-intensive.' },
  { t: 1, q: 'SPECsfs2014 evaluates:', o: ['File servers', '3D graphics', 'Java virtual machines', 'Cloud IaaS platforms'], a: 0, e: 'Speed and request-handling of file servers.' },
  { t: 1, q: "Amdahl's Law shows that the speedup from using more processors is limited by:", o: ['The part of the program that must run serially', 'The size of the hard disk', 'The clock rate only', 'The number of benchmarks'], a: 0, e: 'Speedup = 1 / [(1 − f) + f/N]; even with infinite N it is at most 1/(1 − f).' },

  /* ───────── Topic 2 · number systems (concepts) ───────── */
  { t: 2, q: 'The base (radix) r of a number system tells us:', o: ['How many different digits it uses (0 to r − 1)', 'How many bits a register has', 'The size of the ALU', 'The number of decimal places'], a: 0, e: 'Digits run from 0 to r − 1.' },
  { t: 2, q: 'The digits allowed in base 8 are:', o: ['0 to 7', '0 to 8', '1 to 8', '0 to 9'], a: 0, e: 'Base r → 0 to r − 1.' },
  { t: 2, q: 'Why can 1011 be a number in binary, octal, decimal and hexadecimal?', o: ['It only uses the digits 0 and 1, which exist in all four bases', 'All bases use the same weights', 'It is always equal to eleven', 'Because it has four digits'], a: 0, e: 'Its value differs per base, but every digit is valid in all four.' },
  { t: 2, q: 'The dot that separates the integer part from the fractional part in any base is called the:', o: ['Radix point', 'Decimal point only', 'Binary point only', 'Sign bit'], a: 0, e: 'Radix point (decimal point in base 10, binary point in base 2).' },
  { t: 2, q: 'Digits to the right of the radix point are multiplied by:', o: ['Negative powers of the base', 'Positive powers of the base', 'The base itself', 'Zero'], a: 0, e: 'e.g. 0.1₂ = 1 × 2⁻¹ = 0.5.' },
  { t: 2, q: 'To convert a decimal integer to another base r, we:', o: ['Divide repeatedly by r and read the remainders from bottom to top', 'Multiply repeatedly by r', 'Group the bits in fours', 'Add the digits'], a: 0, e: 'Division–remainder method; the first remainder is the LSB.' },
  { t: 2, q: 'To convert a decimal fraction to binary, we:', o: ['Multiply the fraction by 2 repeatedly and take the integer parts', 'Divide by 2 repeatedly', 'Group into 3 bits', 'Subtract powers of 10'], a: 0, e: 'e.g. 0.625 × 2 = 1.25 → 1; 0.25 × 2 = 0.5 → 0; 0.5 × 2 = 1.0 → 1 ⇒ 0.101.' },
  { t: 2, q: 'A group of four binary digits is called a:', o: ['Nibble', 'Byte', 'Word', 'Radix'], a: 0, e: 'One hexadecimal digit = one nibble.' },
  { t: 2, q: 'To convert binary to octal, group the bits into:', o: ['3-bit groups', '4-bit groups', '2-bit groups', '8-bit groups'], a: 0, e: 'Octal = 3 bits per digit; hexadecimal = 4 bits per digit.' },
  { t: 2, q: 'When grouping binary into hexadecimal, the groups are formed:', o: ['From the radix point outwards, padding with 0s', 'From the left end only', 'From the right end, including the fraction', 'Randomly'], a: 0, e: 'Integer part grouped leftwards from the point, fraction rightwards; pad the ends with 0s.' },
  { t: 2, q: 'Which is NOT a reason given for using hexadecimal notation?', o: ['Computers calculate faster in hexadecimal', 'It is more compact than binary', 'Binary data usually occupy multiples of 4 bits', 'It is easy to convert to and from binary'], a: 0, e: 'Hex is a notation for people; the hardware still works in binary.' },
  { t: 2, q: 'In hexadecimal, the digit E has the decimal value:', o: ['14', '13', '15', '12'], a: 0, e: 'A=10, B=11, C=12, D=13, E=14, F=15.' },
  { t: 2, q: 'Base 60 is known as the:', o: ['Sexagesimal system', 'Duodecimal system', 'Octal system', 'Base-64 encoding'], a: 0, e: 'Base 12 = duodecimal; base 60 = sexagesimal; base 64 = encoding data for transmission.' },
  { t: 2, q: 'Base 12 is called:', o: ['Duodecimal', 'Sexagesimal', 'Hexadecimal', 'Octal'], a: 0, e: 'Duodecimal.' },
  { t: 2, q: 'Base-64 is commonly used for:', o: ['Encoding data for transmission', 'Telling the time', 'Counting in dozens', 'Storing floating-point numbers'], a: 0, e: 'From the slide on other number systems.' },
  { t: 2, q: 'In BCD, each decimal digit is represented by:', o: ['4 bits', '3 bits', '7 bits', '8 bits'], a: 0, e: 'Binary Coded Decimal: one 4-bit group per decimal digit.' },
  { t: 2, q: 'ASCII stands for:', o: ['American Standard Code for Information Interchange', 'Advanced System Code for Internal Instructions', 'American Software Character Index', 'Automatic Standard Code for Integers'], a: 0, e: 'American Standard Code for Information Interchange.' },
  { t: 2, q: '7-bit ASCII can represent:', o: ['128 characters', '256 characters', '64 characters', '512 characters'], a: 0, e: '2⁷ = 128.' },
  { t: 2, q: 'EBCDIC stands for:', o: ['Extended Binary Coded Decimal Interchange Code', 'Extended Basic Character Data Interchange Code', 'Encoded Binary Character Decimal Index Code', 'Extended Binary Computer Data Interface Code'], a: 0, e: 'Developed by IBM.' },
  { t: 2, q: 'EBCDIC uses an 8-bit code, so it can represent:', o: ['256 characters', '128 characters', '64 characters', '1024 characters'], a: 0, e: '2⁸ = 256 characters.' },
  { t: 2, q: 'In the binary number 1001.10, the leftmost 1 has a weight of:', o: ['2³ = 8', '2⁴ = 16', '2² = 4', '2⁰ = 1'], a: 0, e: 'Positions left of the point: 3, 2, 1, 0.' },
  { t: 2, q: 'Binary is the natural language of digital electronics because circuits have:', o: ['Two states (on/off)', 'Ten states', 'Sixteen states', 'No states'], a: 0, e: 'Signals have two discrete values, 0 and 1.' },

  /* ───────── Topic 3 · arithmetic (concepts) ───────── */
  { t: 3, q: 'Which unit does "the calculations", with everything else in the computer there to service it?', o: ['ALU', 'Control unit', 'Main memory', 'I/O module'], a: 0, e: 'The ALU; the CU, registers and memory bring data in and take results out.' },
  { t: 3, q: 'The ALU handles integers and:', o: ['May handle floating-point (real) numbers', 'Only handles characters', 'Handles instructions from the keyboard directly', 'Never handles negative numbers'], a: 0, e: 'Integers always; floating point maybe (or a separate FPU).' },
  { t: 3, q: 'An advantage of unsigned magnitude is:', o: ['One representation of zero and simple addition', 'It can represent negative numbers', 'It has two zeros', 'It needs a sign bit'], a: 0, e: 'Disadvantage: negative numbers cannot be represented.' },
  { t: 3, q: '10011101 as an unsigned number is:', o: ['157', '−29', '−99', '29'], a: 0, e: '128 + 16 + 8 + 4 + 1 = 157. (As signed-magnitude it would be −29.)' },
  { t: 3, q: 'The three methods to represent negative binary numbers are:', o: ["Signed magnitude, 1's complement and 2's complement", 'BCD, ASCII and EBCDIC', 'Octal, decimal and hexadecimal', 'Add-shift, Booth and restoring'], a: 0, e: 'A minus sign cannot simply be put in front of a binary number.' },
  { t: 3, q: 'In all three signed representations (sign-magnitude, 1\'s and 2\'s complement), positive numbers are:', o: ['Represented in the same way', 'Always inverted', 'Stored with a sign bit of 1', 'Stored in BCD'], a: 0, e: 'Only negative numbers differ.' },
  { t: 3, q: 'Which is a drawback of sign-magnitude representation?', o: ['Addition and subtraction are complicated, and there are two zeros', 'It cannot represent positive numbers', 'It has no sign bit', 'It has only one representation of zero'], a: 0, e: 'The hardware must check the signs before adding, and +0 / −0 both exist.' },
  { t: 3, q: 'In sign-magnitude, the negation of a number is formed by:', o: ['Inverting the sign bit', 'Inverting all bits and adding 1', 'Inverting all bits', 'Shifting left'], a: 0, e: "2's complement negation: invert all bits, then add 1." },
  { t: 3, q: "In 1's complement, a negative number is formed by:", o: ['Inverting every bit of the positive number', 'Inverting every bit and adding 1', 'Changing only the sign bit', 'Shifting right'], a: 0, e: "The sign bit is complemented along with the rest." },
  { t: 3, q: "The two rules for forming the 2's complement are:", o: ["Find the 1's complement, then add 1", 'Add 1, then invert the sign bit', 'Shift left, then add 1', "Subtract 1, then find the 1's complement"], a: 0, e: 'Shortcut: from the right, keep bits up to and including the first 1, flip the rest.' },
  { t: 3, q: "The range of n-bit 2's complement is:", o: ['−2ⁿ⁻¹ to +(2ⁿ⁻¹ − 1)', '−(2ⁿ⁻¹ − 1) to +(2ⁿ⁻¹ − 1)', '0 to 2ⁿ − 1', '−2ⁿ to +2ⁿ'], a: 0, e: 'Sign-magnitude: −(2ⁿ⁻¹ − 1) to +(2ⁿ⁻¹ − 1); unsigned: 0 to 2ⁿ − 1.' },
  { t: 3, q: "In 8-bit 2's complement, the MSB has a weight of:", o: ['−128', '+128', '−127', '+1'], a: 0, e: 'e.g. 10000011 = −128 + 2 + 1 = −125.' },
  { t: 3, q: "Which is an advantage of 2's complement listed in the slides?", o: ['Subtraction can be easily performed (it is addition)', 'It has two representations of zero', 'It cannot overflow', 'It is only used for unsigned numbers'], a: 0, e: 'Also: multiplication is repeated addition, division repeated subtraction, widely used in ALUs.' },
  { t: 3, q: 'When adding two n-bit 2\'s complement numbers, a carry out of the MSB is:', o: ['Discarded', 'Always an overflow', 'Added back to the LSB', 'Stored in the sign bit'], a: 0, e: 'Overflow is decided by the sign rule, not by the carry.' },
  { t: 3, q: 'Overflow can only occur when adding two numbers that:', o: ['Have the same sign', 'Have different signs', 'Are both zero', 'Are both odd'], a: 0, e: '(+) + (+) = (−) or (−) + (−) = (+) means overflow. Different signs can never overflow.' },
  { t: 3, q: 'A − B in 2\'s complement is computed as:', o: ["A + (2's complement of B)", "A + (1's complement of A)", 'B − A', "2's complement of (A + B)"], a: 0, e: 'Subtraction is actually addition.' },
  { t: 3, q: 'In the add-shift multiplication method, when the current multiplier bit Q₀ is 1:', o: ['Add M to A, then shift C, A and Q right', 'Only shift right', 'Subtract M from A', 'Shift left'], a: 0, e: 'For each 0 only a shift is needed.' },
  { t: 3, q: 'In the add-shift multiplication hardware, which register stays unchanged?', o: ['M (multiplicand)', 'A', 'Q', 'C'], a: 0, e: 'C, A and Q are shifted; M stays the same.' },
  { t: 3, q: 'Multiplying two n-bit unsigned numbers needs a result of:', o: ['2n bits (double length)', 'n bits', 'n + 1 bits', '4n bits'], a: 0, e: 'The product is held in A and Q together.' },
  { t: 3, q: 'Running addition of partial products in the add-shift method:', o: ['Removes the need to store all the partial products', 'Needs more registers', 'Only works for negative numbers', 'Makes division faster'], a: 0, e: 'Fewer registers; add as you go.' },
  { t: 3, q: "Booth's algorithm was invented by Andrew Donald Booth in the:", o: ['1950s', '1940s', '1970s', '1990s'], a: 0, e: "It multiplies two signed numbers in 2's complement." },
  { t: 3, q: "In Booth's algorithm, when Q₀Q₋₁ = 00 or 11:", o: ['Only shift right A, Q, Q₋₁', 'Add M then shift', 'Subtract M then shift', 'Stop'], a: 0, e: '10 → A − M then shift; 01 → A + M then shift; 00/11 → shift only.' },
  { t: 3, q: "In Booth's algorithm, when Q₀Q₋₁ = 10:", o: ['A ← A − M, then shift right', 'A ← A + M, then shift right', 'Only shift right', 'Shift left'], a: 0, e: '10 = start of a run of 1s → subtract.' },
  { t: 3, q: "An advantage of Booth's algorithm is that it:", o: ['Handles signed (negative) numbers with fewer operations', 'Only works for unsigned numbers', 'Needs no registers', 'Is a division method'], a: 0, e: 'Performs signed multiplication; better when negative numbers are involved.' },
  { t: 3, q: 'In restoring division, each cycle begins by:', o: ['Shifting A and Q left', 'Shifting A and Q right', 'Adding M to Q', 'Clearing M'], a: 0, e: 'Shift left A,Q → A ← A − M → if A < 0: Q₀ = 0 and restore A; else Q₀ = 1.' },
  { t: 3, q: 'In restoring division, if A < 0 after A − M, then:', o: ['Q₀ ← 0 and A is restored (A + M)', 'Q₀ ← 1', 'The division stops', 'M is shifted'], a: 0, e: 'Restore the previous value of A.' },
  { t: 3, q: 'At the end of restoring division, the quotient and remainder are in:', o: ['Q (quotient) and A (remainder)', 'A (quotient) and Q (remainder)', 'M and Q', 'C and A'], a: 0, e: 'Q holds the quotient, A the remainder.' },
  { t: 3, q: 'A floating-point number is represented as:', o: ['± S × B^(±E)', 'S + B + E', '2ⁿ − 1', 'Sign + BCD digits'], a: 0, e: 'Sign, significand S, base B, exponent E.' },
  { t: 3, q: 'In the 32-bit floating-point format, the fields are:', o: ['1 sign bit, 8-bit exponent, 23-bit significand', '1 sign bit, 11-bit exponent, 20-bit significand', '8-bit sign, 8-bit exponent, 16-bit significand', '1 sign bit, 23-bit exponent, 8-bit significand'], a: 0, e: '1 + 8 + 23 = 32.' },
  { t: 3, q: 'The bias for an 8-bit exponent is:', o: ['127', '128', '255', '256'], a: 0, e: 'Bias = 2^(k−1) − 1 = 127.' },
  { t: 3, q: 'A floating-point number is normalised when:', o: ['The leading bit of the significand is 1', 'The exponent is 0', 'The sign bit is 0', 'The significand is all 0s'], a: 0, e: 'Since the leading 1 is always there, it is not stored: 23 bits hold a 24-bit significand.' },
  { t: 3, q: 'IEEE 754 was adopted in ______ and revised in ______.', o: ['1985 / 2008', '1971 / 1985', '1946 / 1952', '2008 / 2017'], a: 0, e: 'Used on virtually all contemporary processors.' },
  { t: 3, q: 'IEEE 754 defines 32-, 64- and 128-bit formats with exponents of:', o: ['8, 11 and 15 bits', '8, 16 and 32 bits', '7, 10 and 14 bits', '11, 15 and 23 bits'], a: 0, e: '8, 11 and 15 bits respectively.' },
  { t: 3, q: 'A negative exponent that is less than the minimum possible value causes:', o: ['Exponent underflow', 'Exponent overflow', 'Significand overflow', 'Significand underflow'], a: 0, e: 'The number is too small and may be reported as 0.' },
  { t: 3, q: 'When aligning significands, digits flowing off the right end cause:', o: ['Significand underflow', 'Significand overflow', 'Exponent overflow', 'Exponent underflow'], a: 0, e: 'Significand overflow = carry out of the MSB when adding two significands of the same sign.' },
  { t: 3, q: 'Floating-point addition and subtraction are more complicated than multiplication because they need:', o: ['Alignment of the exponents', 'A larger bias', 'No normalisation', 'BCD conversion'], a: 0, e: 'FP add/sub has 4 phases, including aligning the significands.' },
  { t: 3, q: "Why do we need floating point instead of fixed point (e.g. 2's complement)?", o: ['Fixed point cannot represent very large numbers or very small fractions', 'Fixed point cannot represent zero', 'Fixed point has no sign bit', 'Floating point uses fewer bits for integers'], a: 0, e: 'Like scientific notation: 9.76 × 10¹⁴.' },
];

/* ───────── helpers for generated questions ───────── */
const hexU = v => v.toString(16).toUpperCase();
function shuffleArr(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
// four distinct options: the correct one first, then distractors (more are made by `more()` if needed)
function opts4(correct, cands, more) {
  const out = [String(correct)];
  for (const c of cands) { const s = String(c); if (out.length < 4 && s !== out[0] && !out.includes(s) && s !== '' && !/NaN|undefined/.test(s)) out.push(s); }
  for (let k = 0; out.length < 4 && k < 200; k++) { const s = String(more()); if (!out.includes(s) && !/NaN|undefined/.test(s)) out.push(s); }
  return out;
}
const flipBit = (s, i) => s.slice(0, i) + (s[i] === '0' ? '1' : '0') + s.slice(i + 1);
const nearBits = s => { const i = rnd(0, s.length - 1); return flipBit(s, i); };
const FR = [0.5, 0.25, 0.75, 0.125, 0.375, 0.625, 0.875];
const bs = (s, b) => `(${s})<sub>${b}</sub>`;
const cvt = (s, b1, b2) => convertExplain(String(s), b1, b2);

/* ───────── generators: each returns { t, q, o, a: 0, e } ───────── */
const GEN = {
  /* Topic 1 · performance calculations */
  cycleTime() {
    const g = pick([0.5, 1, 1.5, 2, 2.5, 4, 5]), ns = 1 / g;
    const f = x => (Math.round(x * 1000) / 1000) + ' ns';
    return { t: 1, q: `A processor runs at ${g} GHz. Its clock cycle time is:`, o: opts4(f(ns), [f(g), f(ns * 10), f(ns / 10), f(2 * ns)], () => f(ns * rnd(2, 9))), a: 0,
      e: `τ = 1/f = 1 / (${g} × 10⁹) s = ${f(ns)}.` };
  },
  mips() {
    const fM = pick([200, 400, 500, 800, 1000, 1200, 1600, 2000]), cpi = pick([1, 1.25, 1.5, 2, 2.5, 4, 5]);
    const m = fM / cpi, r = x => String(Math.round(x * 100) / 100);
    return { t: 1, q: `A ${fM}-MHz processor has an average CPI of ${cpi}. Its MIPS rate is:`, o: opts4(r(m), [r(fM * cpi), r(m * 2), r(m / 2), r(fM)], () => r(m + rnd(1, 50))), a: 0,
      e: `MIPS = f / (CPI × 10⁶) = ${fM} × 10⁶ / (${cpi} × 10⁶) = <b>${r(m)}</b>.` };
  },
  execTime() {
    const Ic = pick([1, 2, 4, 5, 8, 10]), cpi = pick([1, 2, 2.5, 4]), fM = pick([200, 250, 400, 500, 1000]);
    const ms = Ic * 1e6 * cpi / (fM * 1e6) * 1000, f = x => (Math.round(x * 1000) / 1000) + ' ms';
    return { t: 1, q: `A program executes ${Ic} million instructions with an average CPI of ${cpi} on a ${fM}-MHz processor. Its execution time is:`,
      o: opts4(f(ms), [f(ms * 2), f(ms / 2), f(ms * 10), f(ms / cpi)], () => f(ms + rnd(1, 9))), a: 0,
      e: `T = Ic × CPI / f = ${Ic} × 10⁶ × ${cpi} / (${fM} × 10⁶) s = <b>${f(ms)}</b>.` };
  },
  avgCpi() {
    const mixes = [[60, 18, 12, 10], [50, 20, 20, 10], [40, 30, 20, 10], [70, 10, 10, 10], [45, 25, 20, 10]];
    const p = pick(mixes), c = pick([[1, 2, 4, 8], [1, 2, 3, 4], [1, 3, 4, 6], [2, 2, 4, 8]]);
    const cpi = p.reduce((s, x, i) => s + x / 100 * c[i], 0), r = x => String(Math.round(x * 100) / 100);
    return { t: 1, q: `A program's instruction mix is ${p.map((x, i) => `${x}% with CPI ${c[i]}`).join(', ')}. The average CPI is:`,
      o: opts4(r(cpi), [r(c.reduce((s, x) => s + x, 0) / 4), r(cpi + 0.5), r(cpi - 0.3), r(Math.max(...c))], () => r(cpi + rnd(1, 9) / 10)), a: 0,
      e: `CPI = Σ (fraction × CPI) = ${p.map((x, i) => `${x / 100}×${c[i]}`).join(' + ')} = <b>${r(cpi)}</b>.` };
  },
  amdahl() {
    const f = pick([0.5, 0.6, 0.75, 0.8, 0.9, 0.95]), N = pick([2, 4, 8, 16]);
    const s = 1 / ((1 - f) + f / N), r = x => String(Math.round(x * 100) / 100);
    return { t: 1, q: `By Amdahl's Law, if ${f * 100}% of a program can run in parallel on ${N} processors, the speedup is about:`,
      o: opts4(r(s), [r(N), r(N * f), r(1 / (1 - f)), r(s + 1)], () => r(s + rnd(1, 9) / 10)), a: 0,
      e: `Speedup = 1 / [(1 − f) + f/N] = 1 / [${r(1 - f)} + ${f}/${N}] = <b>${r(s)}</b>.` };
  },

  /* Topic 2 · conversions (past-paper style) */
  bin2dec() {
    const v = rnd(17, 255), s = v.toString(2);
    return { t: 2, q: `Convert ${bs(s, 2)} to decimal.`, o: opts4(v, [v + 1, v - 1, v + 2, v - 2, v + 16, v - 16], () => v + rnd(-9, 9)), a: 0, e: cvt(s, 2, 10).html };
  },
  dec2bin() {
    const v = rnd(9, 255), s = v.toString(2);
    return { t: 2, q: `The binary equivalent of ${bs(v, 10)} is:`, o: opts4(s, [nearBits(s), nearBits(s), s.split('').reverse().join(''), (v + 1).toString(2)], () => nearBits(s)), a: 0, e: cvt(v, 10, 2).html };
  },
  binFrac2dec() {
    const v = rnd(3, 63) + pick(FR), s = toBase(v, 2);
    return { t: 2, q: `The decimal equivalent of ${bs(s, 2)} is:`, o: opts4(v, [v + 0.5, v - 0.25, v + 1, v - 1, Math.floor(v) + 0.5], () => v + pick([0.125, -0.125, 2, -2])), a: 0, e: cvt(s, 2, 10).html };
  },
  decFrac2bin() {
    const v = rnd(3, 63) + pick(FR), s = toBase(v, 2);
    const alt = x => toBase(x, 2);
    return { t: 2, q: `Convert ${bs(v, 10)} to binary.`, o: opts4(s, [alt(v + 0.5), alt(v - 0.25), alt(v + 1), alt(v + 0.125)], () => alt(v + pick([2, -2, 0.375]))), a: 0, e: cvt(v, 10, 2).html };
  },
  hex2dec() {
    const v = rnd(26, 255), h = hexU(v);
    return { t: 2, q: `${bs(h, 16)} equals in decimal:`, o: opts4(v, [v + 10, v - 10, v + 16, v - 16, parseInt(h, 10) || v + 1], () => v + rnd(-20, 20)), a: 0, e: cvt(h, 16, 10).html };
  },
  dec2hex() {
    const v = rnd(100, 4000), h = hexU(v);
    return { t: 2, q: `Convert ${bs(v, 10)} to hexadecimal.`, o: opts4(h, [hexU(v + 1), hexU(v - 1), hexU(v + 16), hexU(v - 16)], () => hexU(v + rnd(-40, 40))), a: 0, e: cvt(v, 10, 16).html };
  },
  bin2hex() {
    const v = rnd(65, 4095), s = v.toString(2), h = hexU(v);
    return { t: 2, q: `Convert ${bs(s, 2)} to hexadecimal.`, o: opts4(h, [hexU(v + 1), hexU(v - 1), hexU(v ^ 16), hexU(v ^ 1)], () => hexU(v + rnd(-20, 20))), a: 0, e: cvt(s, 2, 16).html };
  },
  binFrac2hex() {
    const v = rnd(17, 255) + pick([0.5, 0.25, 0.75, 0.125, 0.625, 0.875, 0.375]), s = toBase(v, 2), h = toBase(v, 16);
    return { t: 2, q: `Binary ${s} equals hexadecimal:`, o: opts4(h, [toBase(v + 1, 16), toBase(v + 16, 16), toBase(v + 0.0625, 16), toBase(v - 1, 16)], () => toBase(v + rnd(2, 9), 16)), a: 0, e: cvt(s, 2, 16).html };
  },
  bin2oct() {
    const v = rnd(64, 511), s = v.toString(2), o = v.toString(8);
    return { t: 2, q: `Convert ${bs(s, 2)} to octal.`, o: opts4(o, [(v + 1).toString(8), (v - 1).toString(8), (v + 3).toString(8), (v + 8).toString(8)], () => (v + rnd(-9, 9)).toString(8)), a: 0, e: cvt(s, 2, 8).html };
  },
  hex2bin() {
    const v = rnd(17, 255), h = hexU(v), s = v.toString(2).padStart(8, '0');
    return { t: 2, q: `Convert ${bs(h, 16)} to binary.`, o: opts4(s, [nearBits(s), nearBits(s), (v + 1).toString(2).padStart(8, '0'), (v + 2).toString(2).padStart(8, '0')], () => nearBits(s)), a: 0, e: cvt(h, 16, 2).html };
  },
  oct2dec() {
    const v = rnd(40, 500), o = v.toString(8);
    return { t: 2, q: `${bs(o, 8)} in decimal is:`, o: opts4(v, [parseInt(o, 10), v + 8, v - 8, v + 1], () => v + rnd(-12, 12)), a: 0, e: cvt(o, 8, 10).html };
  },
  hex2oct() {
    const v = rnd(64, 2000), h = hexU(v), o = v.toString(8);
    return { t: 2, q: `Express ${bs(h, 16)} in octal.`, o: opts4(o, [(v + 1).toString(8), (v - 8).toString(8), (v + 8).toString(8), h], () => (v + rnd(-15, 15)).toString(8)), a: 0, e: cvt(h, 16, 8).html };
  },
  oct2hex() {
    const v = rnd(64, 4000), o = v.toString(8), h = hexU(v);
    return { t: 2, q: `Express the octal number ${bs(o, 8)} in hexadecimal.`, o: opts4(h, [hexU(v + 1), hexU(v - 1), hexU(v + 16), o], () => hexU(v + rnd(-30, 30))), a: 0, e: cvt(o, 8, 16).html };
  },
  baseN() {
    const b1 = pick([4, 5, 6, 7, 8, 9, 10]); let b2 = pick([4, 5, 6, 7, 9]); if (b2 === b1) b2 = b1 === 5 ? 7 : 5;
    const v = rnd(20, 300), s1 = v.toString(b1), s2 = v.toString(b2);
    return { t: 2, q: `Convert ${bs(s1, b1)} to base ${b2}.`, o: opts4(s2, [(v + 1).toString(b2), (v - 1).toString(b2), (v + b2).toString(b2), s1], () => (v + rnd(-9, 9)).toString(b2)), a: 0,
      e: `First to decimal: ${bs(s1, b1)} = ${v}. Then divide by ${b2} repeatedly: ${v} = ${bs(s2, b2)}.` + cvt(s1, b1, b2).html };
  },
  bcdEncode() {
    const v = rnd(10, 999), bcd = String(v).split('').map(d => (+d).toString(2).padStart(4, '0')).join(' ');
    const asBin = v.toString(2);
    const swapped = String(v).split('').reverse().map(d => (+d).toString(2).padStart(4, '0')).join(' ');
    return { t: 2, q: `The BCD code for decimal ${v} is:`, o: opts4(bcd, [asBin, swapped, String(v + 1).split('').map(d => (+d).toString(2).padStart(4, '0')).join(' ')], () => bcd.replace(/[01](?=[01]* *$)/, c => c === '0' ? '1' : '0')), a: 0,
      e: `Each decimal digit becomes 4 bits: ${String(v).split('').map(d => `${d} → ${(+d).toString(2).padStart(4, '0')}`).join(', ')}. (${asBin} is pure binary, not BCD.)` };
  },
  bcdDecode() {
    const v = rnd(10, 999), bcd = String(v).split('').map(d => (+d).toString(2).padStart(4, '0')).join(' ');
    const asBinary = parseInt(bcd.replace(/ /g, ''), 2);
    return { t: 2, q: `The BCD value ${bcd} represents the decimal number:`, o: opts4(v, [asBinary, v + 1, Number(String(v).split('').reverse().join('')), v + 10], () => v + rnd(2, 20)), a: 0,
      e: `Read each 4-bit group as one decimal digit. (${asBinary} would be the value if you read it as one binary number.)` };
  },
  digitValue() {
    const n = rnd(1000, 9999), s = String(n), i = rnd(0, 3), d = +s[i], p = 3 - i;
    return { t: 2, q: `In ${bs(n, 10)}, the value of the digit ${d} at position ${p} (counting from 0 on the right) is:`, o: opts4(d * 10 ** p, [d, d * 10 ** (p + 1), d * 10 ** Math.max(p - 1, 0) + (p === 0 ? 1 : 0), 10 ** p], () => d * 10 ** p + rnd(1, 9)), a: 0,
      e: `Value = digit × 10<sup>${p}</sup> = ${d} × ${10 ** p} = ${d * 10 ** p}.` };
  },

  /* Topic 3 · representations */
  signMag() {
    const n = pick([8, 8, 8, 6]), v = rnd(1, 2 ** (n - 1) - 1), s = '1' + bin(v, n - 1);
    return { t: 3, q: `−${v} in ${n}-bit signed-magnitude is:`, o: opts4(s, [bin(-v, n), invert(bin(v, n)), '0' + bin(v, n - 1)], () => nearBits(s)), a: 0,
      e: `Sign bit 1 (negative) + magnitude ${v} = ${bin(v, n - 1)} → <b>${s}</b>. (${bin(-v, n)} is the 2's complement.)` };
  },
  onesComp() {
    const v = rnd(1, 127), s = invert(bin(v, 8));
    return { t: 3, q: `−${v} in 8-bit 1's complement is:`, o: opts4(s, [bin(-v, 8), '1' + bin(v, 7), bin(v, 8)], () => nearBits(s)), a: 0,
      e: `+${v} = ${bin(v, 8)} → invert every bit → <b>${s}</b>.` };
  },
  twosComp() {
    const v = rnd(1, 128), s = bin(-v, 8);
    return { t: 3, q: `−${v} in 8-bit 2's complement is:`, o: opts4(s, [invert(bin(v, 8)), v < 128 ? '1' + bin(v, 7) : '11111111', bin(v, 8)], () => nearBits(s)), a: 0,
      e: twosSteps(-v, 8) };
  },
  twosOfBits() {
    const n = pick([4, 8, 8]), x = rnd(1, 2 ** n - 1), s = bin(x, n), t2 = bin(-x, n);
    return { t: 3, q: `The 2's complement of ${s} is:`, o: opts4(t2, [invert(s), bin(-x + 1, n), bin(-x - 1, n)], () => nearBits(t2)), a: 0,
      e: `Invert → ${invert(s)}, add 1 → <b>${t2}</b>.` };
  },
  onesOfBits() {
    const n = pick([4, 6, 8]), s = bin(rnd(1, 2 ** n - 2), n), o = invert(s);
    return { t: 3, q: `The 1's complement of ${s} is:`, o: opts4(o, [bin(parseInt(o, 2) + 1, n), s, nearBits(o)], () => nearBits(o)), a: 0, e: 'Invert every bit: 0 → 1, 1 → 0.' };
  },
  valueOfPattern() {
    const s = bin(rnd(128, 255), 8), u = parseInt(s, 2), tw = u - 256, sm = -(u - 128), on = -(255 - u);
    const kind = pick(['two', 'two', 'sm', 'uns']);
    const ans = { two: tw, sm, uns: u }[kind], name = { two: "8-bit 2's complement", sm: '8-bit signed-magnitude', uns: '8-bit unsigned' }[kind];
    return { t: 3, q: `Binary ${s} in ${name} equals:`, o: opts4(ans, [tw, sm, u, on, -tw], () => ans + rnd(-5, 5)), a: 0,
      e: `Unsigned = ${u}; signed-magnitude = −${u - 128}; 1's complement = ${on}; 2's complement = −128 + ${u - 128} = ${tw}.` };
  },
  range() {
    const n = pick([4, 5, 6, 8, 10, 12, 16]), kind = pick(['sm', 'two', 'uns', 'two']);
    const r = { sm: [-(2 ** (n - 1) - 1), 2 ** (n - 1) - 1], two: [-(2 ** (n - 1)), 2 ** (n - 1) - 1], uns: [0, 2 ** n - 1] };
    const f = ([a, b]) => `${a} to +${b}`.replace('+0', '0');
    const name = { sm: 'signed-magnitude', two: "2's complement", uns: 'unsigned' }[kind];
    return { t: 3, q: `The range of ${n}-bit ${name} is:`, o: opts4(f(r[kind]), [f(r.sm), f(r.two), f(r.uns), f([-(2 ** n), 2 ** n])], () => f([-(2 ** n) + 1, 2 ** n - 1])), a: 0,
      e: `Unsigned: 0 to 2ⁿ − 1; signed-magnitude: −(2ⁿ⁻¹ − 1) to +(2ⁿ⁻¹ − 1); 2's complement: −2ⁿ⁻¹ to +(2ⁿ⁻¹ − 1). With n = ${n}: ${f(r[kind])}.` };
  },
  minBits() {
    const v = rnd(20, 2000), n = v.toString(2).length;
    return { t: 3, q: `The minimum number of bits needed to store the unsigned number ${v} is:`, o: opts4(n, [n - 1, n + 1, n + 2], () => n + 3), a: 0, e: `2<sup>${n - 1}</sup> = ${2 ** (n - 1)} ≤ ${v} < 2<sup>${n}</sup> = ${2 ** n}, so ${n} bits.` };
  },
  binAdd() {
    const a = rnd(5, 120), b = rnd(5, 120), s = (a + b).toString(2), sa = a.toString(2), sb = b.toString(2);
    return { t: 3, q: `Binary addition ${sa} + ${sb} gives:`, o: opts4(s, [(a ^ b).toString(2), (a + b + 1).toString(2), (a + b - 1).toString(2), (a | b).toString(2)], () => nearBits(s)), a: 0,
      e: `${a} + ${b} = ${a + b} = <b>${s}</b>₂ (1 + 1 = 0 carry 1).` };
  },

  /* Topic 3 · 8-bit 2's complement arithmetic (exactly like Q44–50 of the past paper) */
  add8() {
    const op = pick(['+', '+', '-', '-']);
    let a, b;
    const kind = pick(['pp', 'pn', 'nn', 'np', 'ovf']);
    if (kind === 'pp') { a = rnd(5, 60); b = rnd(5, 60); }
    else if (kind === 'pn') { a = rnd(10, 110); b = -rnd(5, 110); }
    else if (kind === 'nn') { a = -rnd(5, 60); b = -rnd(5, 60); }
    else if (kind === 'np') { a = -rnd(5, 110); b = rnd(5, 110); }
    else { a = pick([1, -1]) * rnd(60, 120); b = (op === '+' ? Math.sign(a) : -Math.sign(a)) * rnd(40, 100); }
    const r = addTrace(a, b, 8, op), res = r.res;
    const show = x => (x < 0 ? `(${x})` : String(x));
    const wrong = [bin((op === '-' ? a - b : a + b) + 1, 8), bin((op === '-' ? a + b : a - b), 8), invert(res), bin((op === '-' ? a - b : a + b) - 1, 8), nearBits(res)];
    const stem = pick([`In 8-bit two's complement, what is the result of ${a} ${op === '-' ? '−' : '+'} ${show(b)}?`,
      `Compute ${a} ${op === '-' ? '−' : '+'} ${show(b)} using 8-bit two's complement.`,
      `Find the 8-bit two's complement result of ${a} ${op === '-' ? '−' : '+'} ${show(b)}.`]);
    return { t: 3, q: stem, o: opts4(res, wrong, () => nearBits(res)), a: 0, e: r.html };
  },
  overflowWhich() {
    const n = pick([4, 5, 8]), lo = -(2 ** (n - 1)), hi = 2 ** (n - 1) - 1;
    const ok = () => { const a = rnd(lo, hi), b = rnd(lo, hi); return a + b >= lo && a + b <= hi ? [a, b] : null; };
    let bad; do { const a = rnd(Math.floor(hi / 2), hi) * pick([1, -1]); const b = Math.sign(a) * rnd(Math.floor(hi / 2), hi); if (a + b > hi || a + b < lo) bad = [a, b]; } while (!bad);
    const goods = []; while (goods.length < 3) { const g = ok(); if (g && !goods.some(x => x[0] === g[0] && x[1] === g[1])) goods.push(g); }
    const f = ([a, b]) => `${a} + ${b < 0 ? '(' + b + ')' : b}`;
    return { t: 3, q: `Which operation causes overflow in ${n}-bit 2's complement (range ${lo} to +${hi})?`, o: [f(bad), ...goods.map(f)], a: 0,
      e: `${f(bad)} = ${bad[0] + bad[1]}, outside ${lo} … +${hi}: both operands have the same sign and the result's sign flips.` };
  },
  addShift() {
    const m = rnd(3, 15), q = rnd(3, 15), p = bin(m * q, 8);
    return { t: 3, q: `Using the add-shift method with 4-bit registers, ${m} × ${q} gives the product A Q =`, o: opts4(p.slice(0, 4) + ' ' + p.slice(4), [bin(m * q + 1, 8), bin(m * q - 1, 8), bin(m + q, 8), bin((m * q) ^ 16, 8)].map(x => x.slice(0, 4) + ' ' + x.slice(4)), () => { const x = nearBits(p); return x.slice(0, 4) + ' ' + x.slice(4); }), a: 0,
      e: `${m} × ${q} = ${m * q} = ${p}. A holds the high half, Q the low half.` + addShiftTrace(m, q, 4).html };
  },
  boothStep() {
    const pair = pick(['00', '01', '10', '11']);
    const ans = { '00': 'Shift right A, Q, Q₋₁ only', '11': 'Shift right A, Q, Q₋₁ only', '10': 'A ← A − M, then shift right', '01': 'A ← A + M, then shift right' }[pair];
    const all = ['Shift right A, Q, Q₋₁ only', 'A ← A − M, then shift right', 'A ← A + M, then shift right', 'Shift left A and Q'];
    return { t: 3, q: `In Booth's algorithm, when Q₀Q₋₁ = ${pair}, the step is:`, o: [ans, ...all.filter(x => x !== ans)].slice(0, 4), a: 0, e: '10 → subtract M; 01 → add M; 00 or 11 → shift only (arithmetic shift right).' };
  },
  restoringDiv() {
    const dd = rnd(5, 15), dv = rnd(2, 5), q = Math.floor(dd / dv), r = dd % dv;
    const f = (a, b) => `Q = ${bin(a, 4)} (${a}), A = ${bin(b, 4)} (${b})`;
    return { t: 3, q: `Restoring division of ${dd} by ${dv} (4-bit registers) ends with:`, o: opts4(f(q, r), [f(r, q), f(q + 1, r), f(q, (r + 1) % dv === r ? r + 1 : (r + 1))], () => f(q, r + rnd(1, 3))), a: 0,
      e: `${dd} ÷ ${dv} = ${q} remainder ${r}: Q holds the quotient, A the remainder.` + divTrace(dd, dv, 4).html };
  },
  ieeeExp() {
    const e = rnd(-40, 40), be = e + 127;
    const frac = pick(['1.101', '1.011', '1.1101001', '1.0001', '1.11']);
    return { t: 3, q: `In IEEE 754 single precision, the stored (biased) exponent for ${frac} × 2<sup>${e}</sup> is:`, o: opts4(bin(be, 8), [bin(e < 0 ? 256 + e : e, 8), bin(be + 1, 8), bin(e + 128, 8)], () => nearBits(bin(be, 8))), a: 0,
      e: `Biased exponent = ${e} + 127 = ${be} = <b>${bin(be, 8)}</b>.` };
  },
  ieeeDecode() {
    const v = pick([1, 2, 3, 5, 6, 0.5, 0.25, 0.75, 1.5, 2.5, 3.5, 6.5, 10, 12, 0.375, 1.25]) * pick([1, -1]);
    const bits = ieeeBits(v), s = `${bits[0]} ${bits.slice(1, 9)} ${bits.slice(9)}`;
    return { t: 3, q: `The IEEE 32-bit value ${s} represents:`, o: opts4(v, [-v, v * 2, v / 2, v + 1], () => v + rnd(2, 9)), a: 0,
      e: `Sign ${bits[0] === '1' ? '1 → negative' : '0 → positive'}; exponent ${bits.slice(1, 9)} = ${parseInt(bits.slice(1, 9), 2)} − 127 = ${parseInt(bits.slice(1, 9), 2) - 127}; significand 1.${bits.slice(9).replace(/0+$/, '') || '0'}. Value = ${v}.` };
  },
};

/* ───────── building papers ───────── */
const GEN_T1 = ['cycleTime', 'mips', 'execTime', 'avgCpi', 'amdahl'];
const GEN_T2 = ['bin2dec', 'dec2bin', 'binFrac2dec', 'decFrac2bin', 'hex2dec', 'dec2hex', 'bin2hex', 'binFrac2hex', 'bin2oct', 'hex2bin', 'oct2dec', 'hex2oct', 'oct2hex', 'baseN', 'bcdEncode', 'bcdDecode', 'digitValue'];
const GEN_T3 = ['signMag', 'onesComp', 'twosComp', 'twosOfBits', 'onesOfBits', 'valueOfPattern', 'range', 'minBits', 'binAdd', 'overflowWhich', 'addShift', 'boothStep', 'restoringDiv', 'ieeeExp', 'ieeeDecode'];
// `seen` holds question texts already in the paper, so a generator never repeats a question in the same paper
function gen(name, seen) {
  let q; for (let k = 0; k < 30; k++) { q = GEN[name](); if (!seen || !seen.has(q.q)) break; }
  q.gen = name; if (seen) seen.add(q.q); return q;
}
function genMany(names, n, seen) { const pool = shuffleArr(names); const out = []; for (let i = 0; i < n; i++) out.push(gen(pool[i % pool.length], seen)); return out; }

// every fixed concept question available (the new bank + the two mock papers; the real past paper is kept apart)
const conceptPool = t => [...BANK, ...MOCK1.qs, ...MOCK2.qs].filter(q => q.t === t && !/^\s*\(|\b(in decimal|to binary|to hexadecimal|to octal|in binary|in hexadecimal|in octal|in base)\b|8-bit 2's complement, -?\d|\d+\s*[+−-]\s*\(?-?\d+\)?\s*=/i.test(q.q));

// A fresh paper with the same shape as the past Test 1: 18 Topic 1, 14 Topic 2, 18 Topic 3,
// with the calculation questions placed where they were in the real paper (Q39–43 conversions, Q44–50 8-bit sums).
function buildRandomPaper() {
  const seen = new Set();
  const pickC = (t, n) => { const a = shuffleArr(conceptPool(t)).slice(0, n); a.forEach(q => seen.add(q.q)); return a; };
  const c1 = pickC(1, 16), c2 = pickC(2, 5), c3 = pickC(3, 6);
  const t1 = c1.concat(genMany(GEN_T1, 2, seen));
  const t2a = c2.concat(genMany(['bin2dec', 'dec2bin', 'binFrac2dec', 'hex2dec', 'binFrac2hex', 'bcdEncode', 'decFrac2bin'], 4, seen));
  const t3a = c3.concat(genMany(['signMag', 'twosComp', 'twosOfBits', 'onesOfBits', 'valueOfPattern', 'range', 'binAdd', 'overflowWhich', 'boothStep'], 5, seen));
  const t2b = genMany(['bin2hex', 'bin2oct', 'dec2hex', 'hex2bin', 'bin2dec', 'oct2dec', 'hex2oct', 'baseN'], 5, seen);
  const t3b = Array.from({ length: 7 }, () => gen('add8', seen));
  return [...shuffleArr(t1), ...shuffleArr(t2a), ...shuffleArr(t3a), ...t2b, ...t3b];
}
function buildTopicSet(t) {
  const names = { 1: GEN_T1, 2: GEN_T2, 3: GEN_T3.concat(['add8', 'add8', 'add8']) }[t];
  const pool = conceptPool(t);
  return shuffleArr(pool.concat(genMany(names, t === 1 ? 10 : 25, new Set(pool.map(q => q.q)))));
}

// papers built fresh for every attempt (the runner in app.js stores the questions with the attempt)
const DYNAMIC = [
  { id: 'random', title: 'Random Test 1', short: 'Random', minutes: 60, shuffle: true, build: buildRandomPaper,
    blurb: 'A brand-new 50-question paper every attempt, with the same shape as the real one: 18 / 14 / 18 by topic, the conversions at Q39–43 and seven 8-bit two\'s complement sums at Q44–50.' },
  { id: 'bank1', title: 'Topic 1 question bank', short: 'Topic 1 bank', minutes: 90, shuffle: true, build: () => buildTopicSet(1),
    blurb: 'Every Topic 1 question (architecture, structure, history, ARM/x86, cloud, performance) plus new MIPS / CPI / Amdahl calculations.' },
  { id: 'bank2', title: 'Topic 2 question bank', short: 'Topic 2 bank', minutes: 90, shuffle: true, build: () => buildTopicSet(2),
    blurb: 'All number-system concept questions plus 25 new conversions (binary, octal, hex, fractions, other bases, BCD) every time.' },
  { id: 'bank3', title: 'Topic 3 question bank', short: 'Topic 3 bank', minutes: 90, shuffle: true, build: () => buildTopicSet(3),
    blurb: 'All arithmetic concept questions plus 25 new calculations: sign-magnitude, 1\'s/2\'s complement, ranges, overflow, add-shift, Booth, division, IEEE 754.' },
];
