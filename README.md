# cov-rank

> JavaScript test coverage leaderboard report generator, inspired by the [ci-game](https://github.com/jenkinsci/ci-game-plugin) Jenkins plugin.

`cov-rank` is a command-line tool for generating a JavaScript unit test coverage leaderboard report by walking through the Git history of a target repository, tracking unit test coverage by commit, and rewarding authors who increase coverage with points.

Inspired by the [ci-game](https://github.com/jenkinsci/ci-game-plugin) Jenkins plugin.

### Algorithm

1. For each commit, generate the repo's test coverage report
    - If the commit increases coverage, increase the author's points
    - If the commit decreases coverage, decrease the the author's points
2. Generate a JSON file with leaderboard information, sorted by an author's rank, including test coverage change events by that author.

### Point Values

- Point values are based on total unit test statement coverage percentage. 
- 1% === 100 points, e.g., a commit that raises overall test statement coverage by 1% will reward the author with 100 points
- Commits that break unit tests will not affect an author's score
- All authors start at 0 points

## Getting Started

1. Install globally with [npm]():

    ```sh
    npm install cov-rank --global
    ```

2. Generate a test coverage leaderboard report

    ```sh
    cov-rank --repo=../target/repo --report=./cov-rank.json
    ```

## Options

All of the following command-line options are optional.

### `--version`

Show version and exit.

### `--repo` 

**Default: `'.'`**

Path to the target repository. The target repository must:

- Exist on the local filesystem, and not be bare
- Include runnable tests (by the `--repo-test-command`) that generates a JSON test coverage summary. (See `--repo-cov-report`.)

### `--repo-test-command` 

**Default: `'npm tst'`**

Test command to run within the repo. The test must generate a coverage summary report. See `--repo-cov-report`.

### `--repo-cov-report` 

**Default: `'./coverage/coverage-summary.json'`**

Path to the test coverage summary JSON file, generated by `--repo-test-command`, in the form:

```json
{
    "/code/foo/bar.js": {
        "statements":   { "total": 4, "covered": 4, "skipped": 0, "pct": 100 },
        ...
    },
    ...
}
```

Coverage tools such as [istanbul](https://github.com/gotwarlost/istanbul) and [gulp-istanbul](https://github.com/SBoudrias/gulp-istanbul) will generate a report summary in this form using the `json-summary` reporter.


### `--report` 

**Default: `'./coverage/coverage-rank.json'`**

Path to the coverage leaderboard JSON report file.

- If the report file does *not* exist, a new one will be created
- If the report file *does* exist, it will be updated, starting from the `lastCommit`.

The report will take the following form:

```json
{
    "lastCommit": {
        "sha":  "6443870b2799bb84c8aff6b0ed38802c36616dda",
        "date": "2014-12-23 15:53:54 -0800"
    },
    "authors": [
        {
            "author": "Homer Simpson",
            "totalScore": 453,
            "changeLog": [
                {
                    "sha": "13824901d09a13438c23d012ea51cc87683002c1",
                    "date": "2014-12-23 15:09:22 -0800",
                    "score": 50
                },
                ...
            ]
        },
        ...
    ]
}
```

**Tip:** If you want to completely re-create the report instead of updating it, simply delete it, and it will be re-created from scratch.

### `--file-filter` (Not yet implemented)

**Default: `null`**

Only include commits that touch files matching the `--file-filter`, e.g., `'*.js'`

## Licence

MIT. See `LICENSE` file.
