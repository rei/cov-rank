# cov-rank

> JavaScript test coverage leaderboard generator

This is a command-line tool for generating a JavaScript unit test coverage leaderboard by walking through the Git history of a target repository, tracking test coverage changes over time, and associating those changes with authors.

## Algorithm

1. For each commit, run the repo's test coverage report
    - if the commit increases coverage, increase the author's points
    - if the commit decreases coverage, decrease the the author's points
2. Generate a JSON file with leaderboard information, sorted by an author's rank, including test coverage change events by that author.

## Target Repo Requirements

The target Git repository must contain runnable tests that are able to generate a code coverage report summary in JSON format with the following structure:

```json
{
    "/code/foo/bar.js": {
        "lines": {
            "total": 4,
            "covered": 4,
            "skipped": 0,
            "pct": 100
        },
        "statements": {
            "total": 4,
            "covered": 4,
            "skipped": 0,
            "pct": 100
        },
        "functions": {
            "total": 1,
            "covered": 1,
            "skipped": 0,
            "pct": 100
        },
        "branches": {
            "total": 2,
            "covered": 2,
            "skipped": 0,
            "pct": 100
        }
    },
    ...
}
```

Coverage tools such as [istanbul](https://github.com/gotwarlost/istanbul) and [gulp-istanbul](https://github.com/SBoudrias/gulp-istanbul) will generate a report summary in this form using the `json-summary` reporter.
