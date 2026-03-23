/* ==============================
   TERMINAL TYPING EFFECT
   ============================== */
(function () {
  if (typeof ScrollTrigger === 'undefined') return;

  const terminalBody = document.getElementById('terminal-body');
  if (!terminalBody) return;

  const commands = [
    {
      cmd: 'cat backend.txt',
      output: 'Java, Spring Boot, NestJS, TypeScript, Python, Kotlin, Node.js',
    },
    {
      cmd: 'cat cloud.txt',
      output: 'AWS (CDK, Lambda, ECS, S3, SQS/SNS), Terraform, GCP, CloudFormation',
    },
    {
      cmd: 'cat devops.txt',
      output: 'Docker, Kubernetes, Jenkins, Bamboo, CI/CD, SonarQube, Grafana',
    },
    {
      cmd: 'cat databases.txt',
      output: 'PostgreSQL, MongoDB, DynamoDB, Oracle, MySQL, DB2',
    },
    {
      cmd: 'cat architecture.txt',
      output: 'Microservices, REST APIs, Event-driven (Kafka), OpenAPI, Design Patterns',
    },
    {
      cmd: 'cat tools.txt',
      output: 'GenAI/LLM, SAFe/Scrum, PCI-DSS, Git, Jira, Confluence',
    },
  ];

  let hasPlayed = false;

  function sleep(ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  function createLine(className, text) {
    const div = document.createElement('div');
    div.className = 'terminal-line ' + className;
    div.textContent = text;
    return div;
  }

  async function typeCommand(cmd) {
    const line = document.createElement('div');
    line.className = 'terminal-line terminal-cmd';
    line.textContent = '$ ';
    terminalBody.appendChild(line);

    // Type characters one by one
    for (let i = 0; i < cmd.length; i++) {
      line.textContent = '$ ' + cmd.substring(0, i + 1);
      await sleep(35);
    }

    return line;
  }

  async function playSequence() {
    if (hasPlayed) return;
    hasPlayed = true;

    for (let i = 0; i < commands.length; i++) {
      await typeCommand(commands[i].cmd);
      await sleep(200);

      const output = createLine('terminal-output', commands[i].output);
      terminalBody.appendChild(output);
      await sleep(400);
    }

    // Final prompt with blinking cursor
    const finalLine = document.createElement('div');
    finalLine.className = 'terminal-line terminal-cmd';
    finalLine.innerHTML = '$ <span class="terminal-cursor-char">|</span>';
    terminalBody.appendChild(finalLine);
  }

  // Trigger on scroll
  ScrollTrigger.create({
    trigger: '#terminal',
    start: 'top 75%',
    once: true,
    onEnter: playSequence,
  });
})();
