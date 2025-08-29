import React, { Component } from 'react'
import $ from 'jquery';
import ReactGA from 'react-ga4';

export class Terminal extends Component {
    constructor() {
        super();
        this.cursor = "";
        this.terminal_rows = 1;
        this.current_directory = "~";
        this.curr_dir_name = "root";
        this.prev_commands = [];
        this.commands_index = -1;
        this.child_directories = {
            root: ["projects", "skills", "interests"],
            skills: ["Front-end development", "React.js", "jQuery", "Flutter", "Express.js", "SQL", "Firebase"],
            projects: ["krishnabaviskar40-portfolio", "task-manager-app", "ecommerce-backend"],
            interests: ["Software Engineering", "Deep Learning", "Computer Vision"],
            languages: ["Javascript", "C++", "Java", "Dart"],
        };
        this.state = {
            terminal: [],
        }
    }

    componentDidMount() {
        this.reStartTerminal();
    }

    componentDidUpdate() {
        clearInterval(this.cursor);
        this.startCursor(this.terminal_rows - 2);
    }

    componentWillUnmount() {
        clearInterval(this.cursor);
    }

    reStartTerminal = () => {
        clearInterval(this.cursor);
        $('#terminal-body').empty();
        this.appendTerminalRow();
    }

    appendTerminalRow = () => {
        let terminal = this.state.terminal;
        terminal.push(this.terminalRow(this.terminal_rows));
        this.setState({ terminal });
        this.terminal_rows += 2;
    }

    terminalRow = (id) => {
        return (
            <React.Fragment key={id}>
                <div className="flex w-full h-5">
                    <div className="flex">
                        <div className=" text-ubt-green">KrishnaBaviskar@LOQ</div>
                        <div className="text-white mx-px font-medium">:</div>
                        <div className=" text-ubt-blue">{this.current_directory}</div>
                        <div className="text-white mx-px font-medium mr-1">$</div>
                    </div>
                    <div id="cmd" onClick={this.focusCursor} className=" bg-transperent relative flex-1 overflow-hidden">
                        <span id={`show-${id}`} className=" float-left whitespace-pre pb-1 opacity-100 font-normal tracking-wider"></span>
                        <div id={`cursor-${id}`} className=" float-left mt-1 w-1.5 h-3.5 bg-white"></div>
                        <input id={`terminal-input-${id}`} data-row-id={id} onKeyDown={this.checkKey} onBlur={this.unFocusCursor} className=" absolute top-0 left-0 w-full opacity-0 outline-none bg-transparent" spellCheck={false} autoFocus={true} autoComplete="off" type="text" />
                    </div>
                </div>
                <div id={`row-result-${id}`} className={"my-2 font-normal"}></div>
            </React.Fragment>
        );

    }

    focusCursor = (e) => {
        clearInterval(this.cursor);
        this.startCursor($(e.target).data("row-id"));
    }

    unFocusCursor = (e) => {
        this.stopCursor($(e.target).data("row-id"));
    }

    startCursor = (id) => {
        clearInterval(this.cursor);
        $(`input#terminal-input-${id}`).trigger("focus");
        // On input change, set current text in span
        $(`input#terminal-input-${id}`).on("input", function () {
            $(`#cmd span#show-${id}`).text($(this).val());
        });
        this.cursor = window.setInterval(function () {
            if ($(`#cursor-${id}`).css('visibility') === 'visible') {
                $(`#cursor-${id}`).css({ visibility: 'hidden' });
            } else {
                $(`#cursor-${id}`).css({ visibility: 'visible' });
            }
        }, 500);
    }

    stopCursor = (id) => {
        clearInterval(this.cursor);
        $(`#cursor-${id}`).css({ visibility: 'visible' });
    }

    removeCursor = (id) => {
        this.stopCursor(id);
        $(`#cursor-${id}`).css({ display: 'none' });
    }

    clearInput = (id) => {
        $(`input#terminal-input-${id}`).trigger("blur");
    }

    checkKey = (e) => {
        if (e.key === "Enter") {
            let terminal_row_id = $(e.target).data("row-id");
            let command = $(`input#terminal-input-${terminal_row_id}`).val().trim();
            if (command.length !== 0) {
                this.removeCursor(terminal_row_id);
                this.handleCommands(command, terminal_row_id);
            }
            else return;
            // push to history
            this.prev_commands.push(command);
            this.commands_index = this.prev_commands.length - 1;

            this.clearInput(terminal_row_id);
        }
        else if (e.key === "ArrowUp") {
            let prev_command;

            if (this.commands_index <= -1) prev_command = "";
            else prev_command = this.prev_commands[this.commands_index];

            let terminal_row_id = $(e.target).data("row-id");

            $(`input#terminal-input-${terminal_row_id}`).val(prev_command);
            $(`#show-${terminal_row_id}`).text(prev_command);

            this.commands_index--;
        }
        else if (e.key === "ArrowDown") {
            let prev_command;

            if (this.commands_index >= this.prev_commands.length) return;
            if (this.commands_index <= -1) this.commands_index = 0;

            if (this.commands_index === this.prev_commands.length) prev_command = "";
            else prev_command = this.prev_commands[this.commands_index];

            let terminal_row_id = $(e.target).data("row-id");

            $(`input#terminal-input-${terminal_row_id}`).val(prev_command);
            $(`#show-${terminal_row_id}`).text(prev_command);

            this.commands_index++;
        }
    }

    childDirectories = (parent) => {
        let files = [];
        files.push(`<div class="flex justify-start flex-wrap">`)
        this.child_directories[parent].forEach(file => {
            files.push(
                `<span class="font-bold mr-2 text-ubt-blue">'${file}'</span>`
            )
        });
        files.push(`</div>`)
        return files;
    }

    closeTerminal = () => {
        $("#close-terminal").trigger('click');
    }

    handleCommands = (command, rowId) => {
        let words = command.split(' ').filter(Boolean);
        let main = words[0];
        words.shift()
        let result = "";
        let rest = words.join(" ");
        rest = rest.trim();
        switch (main) {
            case "cd":
                if (words.length === 0 || rest === "") {
                    this.current_directory = "~";
                    this.curr_dir_name = "root"
                    break;
                }
                if (words.length > 1) {
                    result = "too many arguments, arguments must be <1.";
                    break;
                }

                if (rest === "personal-documents") {
                    result = `bash /${this.curr_dir_name} : Permission denied 😏`;
                    break;
                }

                if (this.child_directories[this.curr_dir_name].includes(rest)) {
                    this.current_directory += "/" + rest;
                    this.curr_dir_name = rest;
                }
                else if (rest === "." || rest === ".." || rest === "../") {
                    result = "Type 'cd' to go back 😅";
                    break;
                }
                else {
                    result = `bash: cd: ${words}: No such file or directory`;
                }
                break;
            case "ls":
                let target = words[0];
                if (target === "" || target === undefined || target === null) target = this.curr_dir_name;

                if (words.length > 1) {
                    result = "too many arguments, arguments must be <1.";
                    break;
                }
                if (target in this.child_directories) {
                    result = this.childDirectories(target).join("");
                }
                else if (target === "personal-documents") {
                    result = "Nope! 🙃";
                    break;
                }
                else {
                    result = `ls: cannot access '${words}': No such file or directory                    `;
                }
                break;
            case "mkdir":
                if (words[0] !== undefined && words[0] !== "") {
                    this.props.addFolder(words[0]);
                    result = "";
                } else {
                    result = "mkdir: missing operand";
                }
                break;
            case "pwd":
                let str = this.current_directory;
                result = str.replace("~", "/home/krishna")
                break;
            case "code":
                if (words[0] === "." || words.length === 0) {
                    this.props.openApp("vscode");
                } else {
                    result = "Command '" + main + "' not found, or not yet implemented.<br>Type 'help' to see a list of available commands.";
                }
                break;
            case "echo":
                result = this.xss(words.join(" "));
                break;
            case "spotify":
                if (words[0] === "." || words.length === 0) {
                    this.props.openApp("spotify");
                } else {
                    result = "Command '" + main + "' not found, or not yet implemented.<br>Type 'help' to see a list of available commands.";
                }
                break;
            case "chrome":
                if (words[0] === "." || words.length === 0) {
                    this.props.openApp("chrome");
                } else {
                    result = "Command '" + main + "' not found, or not yet implemented.<br>Type 'help' to see a list of available commands.";
                }
                break;
            case "todoist":
                if (words[0] === "." || words.length === 0) {
                    this.props.openApp("todo-ist");
                } else {
                    result = "Command '" + main + "' not found, or not yet implemented.<br>Type 'help' to see a list of available commands.";
                }
                break;
            case "trash":
                if (words[0] === "." || words.length === 0) {
                    this.props.openApp("trash");
                } else {
                    result = "Command '" + main + "' not found, or not yet implemented.<br>Type 'help' to see a list of available commands.";
                }
                break;
            case "about-krishna":
                if (words[0] === "." || words.length === 0) {
                    this.props.openApp("about-krishna");
                } else {
                    result = "Command '" + main + "' not found, or not yet implemented.<br>Type 'help' to see a list of available commands.";
                }
                break;
            case "terminal":
                if (words[0] === "." || words.length === 0) {
                    this.props.openApp("terminal");
                } else {
                    result = "Command '" + main + "' not found, or not yet implemented.<br>Type 'help' to see a list of available commands.";
                }
                break;
            case "settings":
                if (words[0] === "." || words.length === 0) {
                    this.props.openApp("settings");
                } else {
                    result = "Command '" + main + "' not found, or not yet implemented.<br>Type 'help' to see a list of available commands.";
                }
                break;
            case "sendmsg":
                if (words[0] === "." || words.length === 0) {
                    this.props.openApp("gedit");
                } else {
                    result = "Command '" + main + "' not found, or not yet implemented.<br>Type 'help' to see a list of available commands.";
                }
                break;
            case "clear":
                this.reStartTerminal();
                return;
            case "exit":
                this.closeTerminal();
                return;
            case "sudo":

                ReactGA.event({
                    category: "Sudo Access",
                    action: "lol",
                });

                result = "<img class=' w-2/5' src='./images/memes/used-sudo-command.webp' />";
                break;
            case "neofetch":
                result = `
                <div class="flex">
                    <img src="./themes/Yaru/apps/ubuntu_white_hex.svg" alt="ubuntu logo" class="w-20 h-20 mr-4" />
                    <div>
                        <p><strong>KrishnaBaviskar@LOQ</strong></p>
                        <p>-------------------</p>
                        <p><strong>OS:</strong> Ubuntu 20.04.2 LTS x86_64</p>
                        <p><strong>Host:</strong> VirtualBox 1.2</p>
                        <p><strong>Kernel:</strong> 5.8.0-43-generic</p>
                        <p><strong>Uptime:</strong> 1 hour, 2 mins</p>
                        <p><strong>Packages:</strong> 2048 (dpkg), 12 (snap)</p>
                        <p><strong>Shell:</strong> bash 5.0.17</p>
                        <p><strong>Resolution:</strong> 1920x1080</p>
                        <p><strong>DE:</strong> GNOME 3.36.8</p>
                        <p><strong>WM:</strong> Mutter</p>
                        <p><strong>WM Theme:</strong> Yaru</p>
                        <p><strong>Theme:</strong> Yaru [GTK2/3]</p>
                        <p><strong>Icons:</strong> Yaru [GTK2/3]</p>
                        <p><strong>Terminal:</strong> gnome-terminal</p>
                        <p><strong>CPU:</strong> Intel i7-10750H (12) @ 5.000GHz</p>
                        <p><strong>GPU:</strong> NVIDIA GeForce GTX 1650 Ti Mobile</p>
                        <p><strong>Memory:</strong> 1589MiB / 15982MiB</p>
                    </div>
                </div>
                `;
                break;
            case "cmatrix":
                result = "<p class='text-green-400'>The Matrix has you...</p><p class='text-green-400'>Follow the white rabbit.</p>";
                break;
            case "ls -la":
                result = `
                <p>total 42</p>
                <p>drwxr-xr-x 1 krishna krishna 4096 Aug 29 10:00 .</p>
                <p>drwxr-xr-x 1 krishna krishna 4096 Aug 29 09:58 ..</p>
                <p>-rw-r--r-- 1 krishna krishna 220 Aug 29 09:58 .bash_logout</p>
                <p>-rw-r--r-- 1 krishna krishna 3771 Aug 29 09:58 .bashrc</p>
                <p>-rw-r--r-- 1 krishna krishna 807 Aug 29 09:58 .profile</p>
                <p>drwxr-xr-x 1 krishna krishna 4096 Aug 29 10:00 projects</p>
                <p>drwxr-xr-x 1 krishna krishna 4096 Aug 29 10:00 skills</p>
                <p>drwxr-xr-x 1 krishna krishna 4096 Aug 29 10:00 interests</p>
                <p>drwxr-xr-x 1 krishna krishna 4096 Aug 29 10:00 languages</p>
                `;
                break;
            case "whoami":
                result = "krishna";
                break;
            case "ifconfig":
                result = `
                <p>eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500</p>
                <p>        inet 172.17.0.2  netmask 255.255.0.0  broadcast 172.17.255.255</p>
                <p>        ether 02:42:ac:11:00:02  txqueuelen 0  (Ethernet)</p>
                <p>        RX packets 8  bytes 648 (648.0 B)</p>
                <p>        RX errors 0  dropped 0  overruns 0  frame 0</p>
                <p>        TX packets 8  bytes 648 (648.0 B)</p>
                <p>        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0</p>
                <p>lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536</p>
                <p>        inet 127.0.0.1  netmask 255.0.0.0</p>
                <p>        loop  txqueuelen 1000  (Local Loopback)</p>
                <p>        RX packets 0  bytes 0 (0.0 B)</p>
                <p>        RX errors 0  dropped 0  overruns 0  frame 0</p>
                <p>        TX packets 0  bytes 0 (0.0 B)</p>
                <p>        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0</p>
                `;
                break;
            case "uname -a":
                result = "Linux LOQ 5.8.0-43-generic #49~20.04.1-Ubuntu SMP Fri Feb 5 09:57:56 UTC 2021 x86_64 x86_64 x86_64 GNU/Linux";
                break;
            case "netstat":
                result = `
                <p>Active Internet connections (w/o servers)</p>
                <p>Proto Recv-Q Send-Q Local Address           Foreign Address         State</p>
                <p>tcp        0      0 172.17.0.2:4200         172.17.0.1:4200         ESTABLISHED</p>
                <p>tcp        0      0 172.17.0.2:4201         172.17.0.1:4201         ESTABLISHED</p>
                `;
                break;
            case "man":
                if (words[0] !== undefined && words[0] !== "") {
                    if (this.commands.includes(words[0])) {
                        result = `NAME\n\t${words[0]} - command description\n\nSYNOPSIS\n\t${words[0]} [OPTION]...\n\nDESCRIPTION\n\tThis is a dummy man page for the ${words[0]} command.`;
                    } else {
                        result = `No manual entry for ${words[0]}`;
                    }
                } else {
                    result = "What manual page do you want?";
                }
                break;
            case "grep":
                result = "grep: not implemented yet";
                break;
            case "find":
                result = "find: not implemented yet";
                break;
            case "rm":
                if (words[0] !== undefined && words[0] !== "") {
                    if (this.files[words[0]] !== undefined) {
                        delete this.files[words[0]];
                        result = "";
                    } else {
                        result = `rm: cannot remove '${words[0]}': No such file or directory`;
                    }
                } else {
                    result = "rm: missing operand";
                }
                break;
            case "cat":
                if (words[0] !== undefined && words[0] !== "") {
                    if (this.files[words[0]] !== undefined) {
                        result = this.files[words[0]];
                    } else {
                        result = `cat: ${words[0]}: No such file or directory`;
                    }
                } else {
                    result = "cat: missing operand";
                }
                break;
            case "nmap":
                result = `
                <p>Starting Nmap 7.92 ( https://nmap.org ) at 2025-08-29 10:00 UTC</p>
                <p>Nmap scan report for localhost (127.0.0.1)</p>
                <p>Host is up (0.00010s latency).</p>
                <p>Not shown: 995 closed tcp ports (reset)</p>
                <p>PORT      STATE SERVICE</p>
                <p>22/tcp    open  ssh</p>
                <p>80/tcp    open  http</p>
                <p>443/tcp   open  https</p>
                <p>3306/tcp  open  mysql</p>
                <p>8080/tcp  open  http-proxy</p>
                <p>Nmap done: 1 IP address (1 host up) scanned in 0.08 seconds</p>
                `;
                break;
            case "hydra":
                result = `
                <p>Hydra v9.4-dev (c) 2022 by van Hauser/THC - Please do not use in military or secret service organizations, or for illegal purposes.</p>
                <p>Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2025-08-29 10:00:00</p>
                <p>[DATA] max 1 task per 1 server, overall 1 task, 1 login try (l:1/p:1), ~1 try per task</p>
                <p>[DATA] attacking ssh://127.0.0.1:22/</p>
                <p>[ATTEMPT] target 127.0.0.1 - login "admin" - pass "password" - 1 of 1 [child 0]</p>
                <p>[SUCCESS] 1 of 1 target successfully completed, 1 valid password found</p>
                <p>Hydra finished.</p>
                `;
                break;
            case "sqlmap":
                result = `
                <p>    sqlmap/1.6.6#stable (https://sqlmap.org)</p>
                <p>    [*] starting @ 2025-08-29 10:00:00 /2025-08-29 10:00:00/</p>
                <p>    [10:00:00] [INFO] starting</p>
                <p>    [10:00:00] [INFO] testing connection to the target URL</p>
                <p>    [10:00:00] [INFO] checking if the target is protected by some kind of WAF/IPS/IDS</p>
                <p>    [10:00:00] [INFO] testing if GET parameter 'id' is dynamic</p>
                <p>    [10:00:00] [INFO] confirming that GET parameter 'id' is dynamic</p>
                <p>    [10:00:00] [INFO] GET parameter 'id' is vulnerable. Do you want to keep testing the others (if any)? [y/N] N</p>
                <p>    sqlmap identified the following injection point(s) with a total of 46 HTTP(s) requests:</p>
                <p>    ---</p>
                <p>    Parameter: id (GET)</p>
                <p>        Type: boolean-based blind</p>
                <p>        Title: AND boolean-based blind - WHERE or HAVING clause</p>
                <p>        Payload: id=1' AND 1=1--</p>
                <p>    ---</p>
                <p>    [10:00:00] [INFO] the back-end DBMS is MySQL</p>
                <p>    web server operating system: Linux Ubuntu</p>
                <p>    web application technology: Apache 2.4.29</p>
                <p>    back-end DBMS: MySQL >= 5.0</p>
                <p>    [10:00:00] [INFO] fetched data logged to text files under '/home/user/.sqlmap/output/127.0.0.1'</p>
                <p>    [*] ending @ 2025-08-29 10:00:00 /2025-08-29 10:00:00/</p>
                `;
                break;
            case "john":
                result = `
                <p>Using default input encoding: UTF-8</p>
                <p>Loaded 1 password hash (descrypt, traditional crypt(3) [64/64])</p>
                <p>Cost 1 (iteration count) is 1024 for all loaded hashes</p>
                <p>Will run 4 OpenMP threads</p>
                <p>Press 'q' or Ctrl-C to abort, almost any other key for status</p>
                <p>0g 0:00:00:00 0.00% (ETA: 2025-08-29 10:00) 0g/s 12345p/s 12345c/s 12345C/s 123456..*7¡Vamos!</p>
                <p>password123      (root)</p>
                <p>1g 0:00:00:00 100.00% (2025-08-29 10:00) 1.000g/s 12345p/s 12345c/s 12345C/s 123456..*7¡Vamos!</p>
                <p>Session completed</p>
                `;
                break;
            case "hashcat":
                result = `
                <p>hashcat (v6.2.5) starting...</p>
                <p>OpenCL Platform #1: NVIDIA Corporation</p>
                <p>======================================</p>
                <p>* Device #1: NVIDIA GeForce GTX 1650 Ti Mobile, 1024/4096 MB allocatable, 16MCU</p>
                <p>Minimum password length supported by kernel: 0</p>
                <p>Maximum password length supported by kernel: 256</p>
                <p>Hashes: 1 digests; 1 salts</p>
                <p>Applicable optimizers applied: Zero-Byte</p>
                <p>Watchdog: Temperature abort trigger set to 90c</p>
                <p>Host memory required for this attack: 64 MB</p>
                <p>Dictionary cache built:</p>
                <p>* Filename..: /usr/share/wordlists/rockyou.txt</p>
                <p>* Passwords.: 14344392</p>
                <p>* Bytes.....: 139921507</p>
                <p>* Keyspace..: 14344392</p>
                <p>Session..........: hashcat</p>
                <p>Status...........: Cracked</p>
                <p>Hash.Name........: SHA256</p>
                <p>Hash.Target......: aa1538a7b3396452a89b281413e745a3a19a0155343533f4a33651775a565a99</p>
                <p>Time.Started.....: Fri Aug 29 10:00:00 2025 (0 secs)</p>
                <p>Time.Estimated...: Fri Aug 29 10:00:00 2025 (0 secs)</p>
                <p>Guess.Base.......: File (/usr/share/wordlists/rockyou.txt)</p>
                <p>Guess.Queue......: 1/1 (100.00%)</p>
                <p>Speed.#1.........:  118.8 kH/s (0.08ms) @ Accel:1024 Loops:1024 Thr:1024 Vec:1</p>
                <p>Recovered........: 1/1 (100.00%) Digests</p>
                <p>Progress.........: 14344392/14344392 (100.00%)</p>
                <p>Rejected.........: 0/14344392 (0.00%)</p>
                <p>Restore.Point....: 14344392/14344392 (100.00%)</p>
                <p>Restore.Sub.#1...: Salt:0 Amplifier:0-1 Iteration:1023-1024</p>
                <p>Candidates.#1....: password -> zzzzzzzzzzzzzzzzzzzzzzz</p>
                <p>Started: Fri Aug 29 10:00:00 2025</p>
                <p>Stopped: Fri Aug 29 10:00:00 2025</p>
                `;
                break;
            case "metasploit":
                result = `
                <p>Metasploit Park, a place where you can test your skills :)</p>
                <p>       =[ metasploit v6.1.30-dev-                           ]</p>
                <p>+ -- --=[ 2202 exploits - 1162 auxiliary - 362 post        ]</p>
                <p>+ -- --=[ 596 payloads - 45 encoders - 11 nops            ]</p>
                <p>+ -- --=[ 9 evasion                                       ]</p>
                <p>Metasploit Framework Initialized.</p>
                <p>msf6 > </p>
                `;
                break;
            case "aircrack-ng":
                result = `
                <p>Opening /dev/hci0</p>
                <p>Opening /dev/hci0</p>
                <p>Read 42 packets.</p>
                <p>No networks found, exiting.</p>
                `;
                break;
            case "help":
                result = "Available Commands: [ cd, ls, pwd, echo, clear, exit, mkdir, code, spotify, chrome, about-krishna, todoist, trash, settings, sendmsg, neofetch, cmatrix, ls -la, whoami, ifconfig, uname -a, netstat, ps aux, nmap, hydra, sqlmap, john, hashcat, metasploit, aircrack-ng, help ]";
                break;
            default:
                result = "Command '" + main + "' not found, or not yet implemented.<br>Type 'help' to see a list of available commands.";
        }
        document.getElementById(`row-result-${rowId}`).innerHTML = result;
        this.appendTerminalRow();
    }

    xss(str) {
        if (!str) return;
        return str.split('').map(char => {
            switch (char) {
                case '&':
                    return '&amp';
                case '<':
                    return '&lt';
                case '>':
                    return '&gt';
                case '"':
                    return '&quot';
                case "'":
                    return '&#x27';
                case '/':
                    return '&#x2F';
                default:
                    return char;
            }
        }).join('');
    }

    render() {
        return (
            <div className="h-full w-full bg-ub-drk-abrgn text-white text-sm font-bold" id="terminal-body">
                {
                    this.state.terminal
                }
            </div>
        )
    }
}

export default Terminal

export const displayTerminal = (addFolder, openApp) => {
    return <Terminal addFolder={addFolder} openApp={openApp}> </Terminal>;
}
