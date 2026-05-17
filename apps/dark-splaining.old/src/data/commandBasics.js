export const commandBasics = [
  {
    id: "linux-navigation",
    platform: "Linux",
    title: "Linux Navigation",
    description: "Move around a Linux filesystem and inspect your current location.",
    difficulty: "Beginner",
    commands: [
      { command: "pwd", purpose: "Print the current working directory.", example: "pwd" },
      { command: "ls", purpose: "List files and directories.", example: "ls -la" },
      { command: "cd", purpose: "Change directory.", example: "cd /var/log" },
    ],
    exercises: [
      {
        prompt: "Print the current working directory.",
        expected: "pwd",
        success: "Good. You asked the shell to show the current path.",
        hint: "Use the short command that means print working directory.",
      },
      {
        prompt: "List all files, including hidden files, in long format.",
        expected: "ls -la",
        success: "Nice. That is the common long listing view with hidden files.",
        hint: "Use ls with the flags for long output and all files.",
      },
    ],
  },
  {
    id: "linux-files",
    platform: "Linux",
    title: "Linux Files",
    description: "Read file contents and inspect the beginning or end of logs.",
    difficulty: "Beginner",
    commands: [
      { command: "cat", purpose: "Print a file to the terminal.", example: "cat README.md" },
      { command: "head", purpose: "Show the first lines of a file.", example: "head -n 20 access.log" },
      { command: "tail", purpose: "Show the last lines of a file.", example: "tail -n 50 auth.log" },
      { command: "less", purpose: "Page through a file interactively.", example: "less syslog" },
    ],
    exercises: [
      {
        prompt: "Show the last 20 lines of auth.log.",
        expected: "tail -n 20 auth.log",
        success: "Correct. tail is useful for recent log activity.",
        hint: "Use tail with -n and the number of lines.",
      },
    ],
  },
  {
    id: "linux-search",
    platform: "Linux",
    title: "Linux Search",
    description: "Find files and search text patterns in logs or source code.",
    difficulty: "Beginner",
    commands: [
      { command: "find", purpose: "Search for files by name, type, or path.", example: "find . -name \"*.log\"" },
      { command: "grep", purpose: "Search text for matching lines.", example: "grep \"failed\" auth.log" },
    ],
    exercises: [
      {
        prompt: "Search auth.log for failed login lines.",
        expected: "grep \"failed\" auth.log",
        success: "Exactly. grep is the classic text search tool.",
        hint: "Use grep with the search word in quotes and the file name.",
      },
    ],
  },
  {
    id: "linux-processes",
    platform: "Linux",
    title: "Linux Processes",
    description: "Inspect running processes and understand safe process control basics.",
    difficulty: "Intermediate",
    commands: [
      { command: "ps", purpose: "Show process snapshots.", example: "ps aux" },
      { command: "top", purpose: "View live process activity.", example: "top" },
      { command: "kill", purpose: "Send a signal to a process by PID.", example: "kill 1234" },
    ],
    exercises: [
      {
        prompt: "List all running processes in a common detailed format.",
        expected: "ps aux",
        success: "Correct. ps aux gives a broad process snapshot.",
        hint: "Use ps with the common aux flags.",
      },
    ],
  },
  {
    id: "linux-networking",
    platform: "Linux",
    title: "Linux Networking",
    description: "Inspect network interfaces, connectivity, HTTP responses, and sockets.",
    difficulty: "Intermediate",
    commands: [
      { command: "ip", purpose: "Inspect network addresses and routes.", example: "ip addr" },
      { command: "ping", purpose: "Test basic reachability.", example: "ping example.com" },
      { command: "curl", purpose: "Make HTTP requests from the terminal.", example: "curl -I https://example.com" },
      { command: "ss", purpose: "Inspect sockets and listening ports.", example: "ss -tulpen" },
      { command: "netstat", purpose: "Legacy socket and route inspection.", example: "netstat -tulpen" },
    ],
    exercises: [
      {
        prompt: "Request only the HTTP headers from https://example.com.",
        expected: "curl -I https://example.com",
        success: "Correct. -I asks curl for response headers only.",
        hint: "Use curl with uppercase i as the flag.",
      },
    ],
  },
  {
    id: "powershell-navigation",
    platform: "PowerShell",
    title: "PowerShell Navigation",
    description: "Move around folders with PowerShell cmdlets and aliases.",
    difficulty: "Beginner",
    commands: [
      { command: "Get-Location", purpose: "Show the current location.", example: "Get-Location" },
      { command: "Get-ChildItem", purpose: "List files and directories.", example: "Get-ChildItem -Force" },
      { command: "Set-Location", purpose: "Change location.", example: "Set-Location C:\\Windows" },
    ],
    exercises: [
      {
        prompt: "Show your current PowerShell location.",
        expected: "Get-Location",
        success: "Correct. Get-Location is the PowerShell way to ask where you are.",
        hint: "Use the Verb-Noun cmdlet for current location.",
      },
      {
        prompt: "List files including hidden items.",
        expected: "Get-ChildItem -Force",
        success: "Good. -Force includes hidden/system items where visible.",
        hint: "Use Get-ChildItem with the Force parameter.",
      },
    ],
  },
  {
    id: "powershell-files",
    platform: "PowerShell",
    title: "PowerShell Files",
    description: "Read file content and search text using object-aware cmdlets.",
    difficulty: "Beginner",
    commands: [
      { command: "Get-Content", purpose: "Read file contents.", example: "Get-Content .\\app.log" },
      { command: "Select-String", purpose: "Search for text patterns.", example: "Select-String -Path .\\app.log -Pattern \"failed\"" },
    ],
    exercises: [
      {
        prompt: "Search app.log for the word failed.",
        expected: "Select-String -Path .\\app.log -Pattern \"failed\"",
        success: "Correct. Select-String searches text and returns matching lines.",
        hint: "Use Select-String with Path and Pattern.",
      },
    ],
  },
  {
    id: "powershell-processes",
    platform: "PowerShell",
    title: "PowerShell Processes",
    description: "Inspect and stop processes with readable cmdlets.",
    difficulty: "Intermediate",
    commands: [
      { command: "Get-Process", purpose: "List running processes.", example: "Get-Process" },
      { command: "Stop-Process", purpose: "Stop a process by name or ID.", example: "Stop-Process -Id 1234" },
    ],
    exercises: [
      {
        prompt: "List running processes.",
        expected: "Get-Process",
        success: "Correct. Get-Process returns live process objects.",
        hint: "Use the PowerShell cmdlet that starts with Get.",
      },
    ],
  },
  {
    id: "powershell-networking",
    platform: "PowerShell",
    title: "PowerShell Networking",
    description: "Test connectivity and make web requests safely in a mock setting.",
    difficulty: "Intermediate",
    commands: [
      { command: "Test-NetConnection", purpose: "Test network connectivity and ports.", example: "Test-NetConnection example.com -Port 443" },
      { command: "Invoke-WebRequest", purpose: "Make web requests.", example: "Invoke-WebRequest https://example.com" },
    ],
    exercises: [
      {
        prompt: "Test whether example.com responds on port 443.",
        expected: "Test-NetConnection example.com -Port 443",
        success: "Correct. Test-NetConnection is useful for quick port checks.",
        hint: "Use Test-NetConnection with the host and -Port 443.",
      },
    ],
  },
];
