# Mobile Specifics

Mobile is a first-class platform for agent-native apps, with unique constraints and opportunities.

<!-- TOC -->
- [The Challenge](#the-challenge)
- [iCloud-First Storage](#icloud-first-storage)
- [Checkpoint and Resume](#checkpoint-and-resume)
- [Background Execution](#background-execution)
- [Cloud File States](#cloud-file-states)
- [On-Device vs Cloud](#on-device-vs-cloud)
<!-- /TOC -->

---

## The Challenge

Agents are long-running. Mobile apps are not.

iOS will background your app after seconds of inactivity, and may kill it to reclaim memory. Users switch apps, take calls, and lock their phone mid-task. Mobile agent apps must handle:

- **Checkpointing** — saving state so work isn't lost
- **Resuming** — picking up where you left off
- **Background execution** — using limited background time wisely
- **On-device vs cloud** — deciding what runs locally vs what needs a server

---

## iCloud-First Storage

Use iCloud with a local fallback so data syncs across devices without building server infrastructure.

```swift
var containerURL: URL {
    if let iCloudURL = FileManager.default
        .url(forUbiquityContainerIdentifier: nil) {
        return iCloudURL.appendingPathComponent("Documents")
    }
    return FileManager.default
        .urls(for: .documentDirectory, in: .userDomainMask)[0]
}
```

**Directory structure:**
```
iCloud.com.{bundleId}/Documents/
├── Library/
├── Research/books/
├── Chats/
├── AgentCheckpoints/    # Ephemeral
├── AgentLogs/           # Debugging
└── Profile/
```

**Migration layer:** Auto-migrate local → iCloud when the container becomes available.

Use a storage abstraction layer — don't use raw `FileManager` throughout the codebase:
```swift
let url = StorageService.shared.url(for: .researchBook(bookId: id))
```

---

## Checkpoint and Resume

Save and restore agent sessions across interruptions.

```swift
struct AgentCheckpoint: Codable {
    let agentType: String
    let messages: [[String: Any]]
    let iterationCount: Int
    let taskListJSON: String?
    let customState: [String: String]
    let timestamp: Date
}

func isValid(maxAge: TimeInterval = 3600) -> Bool {
    Date().timeIntervalSince(timestamp) < maxAge
}
```

**What to checkpoint:**
- Full message history
- Iteration count
- Task list with completion status
- Custom state (entity IDs, file paths, progress markers)
- Timestamp for validity checking

**When to checkpoint:**
- On app backgrounding
- After each tool result (maximum robustness)
- Periodically during long operations

**Resume flow:**
1. `loadInterruptedSessions()` scans checkpoint directory on launch
2. Filter by `isValid(maxAge:)` — default 1 hour
3. Show resume prompt if valid sessions exist
4. Restore messages and continue agent loop
5. Delete checkpoint on dismiss or completion

**Architecture decision:** Store full agent configuration in the checkpoint, or store only `agentType` and recreate from a registry. Registry approach is simpler but means config changes can break old checkpoints.

---

## Background Execution

iOS gives roughly 30 seconds of background time. Use it to:

```swift
func prepareForBackground() {
    backgroundTaskId = UIApplication.shared
        .beginBackgroundTask(withName: "AgentProcessing") {
            handleBackgroundTimeExpired()
        }
}

func handleBackgroundTimeExpired() {
    for session in sessions where session.status == .running {
        session.status = .backgrounded
        Task { await saveSession(session) }
    }
}

func handleForeground() {
    for session in sessions where session.status == .backgrounded {
        Task { await resumeSession(session) }
    }
}
```

**Priority order in background:**
1. Complete the current tool call if possible
2. Checkpoint the session state
3. Transition gracefully to `.backgrounded` state

**For truly long-running agents:** Use a server-side orchestrator that runs for hours, with the mobile app as a viewer and input mechanism.

---

## Cloud File States

Files may exist in iCloud but not be downloaded locally. Ensure availability before reading:

```swift
await StorageService.shared
    .ensureDownloaded(folder: .research, filename: "full_text.txt")
```

Watch for download state changes using `NSMetadataQuery` and respond appropriately — don't assume a file path means the file is locally available.

---

## On-Device vs Cloud

| Component | On-device | Cloud |
|-----------|-----------|-------|
| Orchestration | Yes | No |
| Tool execution (files, photos, HealthKit) | Yes | No |
| LLM calls | No | Yes (Anthropic API) |
| Checkpoints | Yes (local files + iCloud) | Optional |
| Long-running agents | Limited by iOS | Possible with server |

The app requires network for reasoning but can access local data offline. Design tools to degrade gracefully when the network is unavailable — read from local cache, queue writes for sync.
