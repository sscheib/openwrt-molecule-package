// jshint esversion: 6
module.exports = {
    parserPreset: 'conventional-changelog-conventionalcommits',
    rules: {
        'body-leading-blank': [1, 'always'],
        'body-max-line-length': [2, 'always', 100],
        'footer-leading-blank': [1, 'always'],
        'footer-max-line-length': [2, 'always', 100],
        'header-max-length': [2, 'always', 100],
        'signed-off-and-coauthored': [2, 'always'],
        'subject-case': [
            2,
            'always',
            ['sentence-case'],
        ],
        'subject-empty': [2, 'never'],
        'subject-full-stop': [2, 'never', '.'],
        'type-case': [2, 'always', 'lower-case'],
        'type-empty': [2, 'never'],
        'type-enum': [
            2,
            'always',
            [
                'build',
                'chore',
                'ci',
                'docs',
                'feat',
                'fix',
                'perf',
                'refactor',
                'revert',
                'style',
                'test',
                'tests',
            ],
        ],
    },
    plugins: [
      {
	rules: {
	  // scan the raw message: depending on the parser version the trailers
	  // (Signed-off-by, Co-authored-by) land in body or footer
	  'signed-off-and-coauthored': ({ raw, body }) => {
	    const lines = ((raw || body) || '').trim().split('\n');
	    const signOffPattern = /^Signed-off-by: .+ <.+>$/;
	    const coAuthorPattern = /^Co-authored-by: .+ <.+>$/;

	    let signOffLines = [];
	    let coAuthorsBeforeSignOff = false;

	    // scan the commit message lines
	    for (let i = 0; i < lines.length; i++) {
	      const line = lines[i];

	      if (signOffPattern.test(line)) {
		signOffLines.push(i); // collect indexes of Signed-off-by lines
	      } else if (coAuthorPattern.test(line)) {
		// check if Co-authored-by lines appear before any Signed-off-by
		if (signOffLines.length === 0) {
		  coAuthorsBeforeSignOff = true;
		}
	      }
	    }

	    // ensure at least one Signed-off-by is present
	    if (signOffLines.length === 0) {
	      return [false, 'Commit message must include at least one valid "Signed-off-by" footer.'];
	    }

	    // ensure no Co-authored-by lines appear before Signed-off-by
	    if (coAuthorsBeforeSignOff) {
	      return [
		false,
		'"Co-authored-by" lines must appear after the last "Signed-off-by" footer.',
	      ];
	    }

	    // ensure all lines after the last Signed-off-by are Co-authored-by
	    const lastSignOffIndex = signOffLines[signOffLines.length - 1];
	    for (let i = lastSignOffIndex + 1; i < lines.length; i++) {
	      if (!coAuthorPattern.test(lines[i])) {
		return [
		  false,
		  'All lines after the last "Signed-off-by" must be valid "Co-authored-by" footers.',
		];
	      }
	    }

	    return [
	      true,
	      'Commit message has valid "Signed-off-by" footers and correctly placed "Co-authored-by" lines.',
	    ];
	  },
	},
      },
    ],
    prompt: {
        questions: {
            type: {
                description: "Select the type of change that you're committing",
                enum: {
                    feat: {
                        description: 'A new feature',
                        title: 'Features',
                    },
                    fix: {
                        description: 'A bug fix',
                        title: 'Bug Fixes',
                    },
                    docs: {
                        description: 'Documentation only changes',
                        title: 'Documentation',
                    },
                    style: {
                        description:
                            'Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)',
                        title: 'Styles',
                    },
                    refactor: {
                        description:
                            'A code change that neither fixes a bug nor adds a feature',
                        title: 'Code Refactoring',
                    },
                    perf: {
                        description: 'A code change that improves performance',
                        title: 'Performance Improvements',
                    },
                    test: {
                        description: 'Adding missing tests or correcting existing tests',
                        title: 'Tests',
                    },
                    tests: {
                        description: 'Adding missing tests or correcting existing tests',
                        title: 'Tests',
                    },
                    build: {
                        description:
                            'Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)',
                        title: 'Builds',
                    },
                    ci: {
                        description:
                            'Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)',
                        title: 'Continuous Integrations',
                    },
                    chore: {
                        description: "Other changes that don't modify src or test files",
                        title: 'Chores',
                    },
                    revert: {
                        description: 'Reverts a previous commit',
                        title: 'Reverts',
                    },
                },
            },
            scope: {
                description:
                    'What is the scope of this change (e.g. component or file name)',
            },
            subject: {
                description:
                    'Write a short, imperative tense description of the change',
            },
            body: {
                description: 'Provide a longer description of the change',
            },
            isBreaking: {
                description: 'Are there any breaking changes?',
            },
            breakingBody: {
                description:
                    'A BREAKING CHANGE commit requires a body. Please enter a longer description of the commit itself',
            },
            breaking: {
                description: 'Describe the breaking changes',
            },
            isIssueAffected: {
                description: 'Does this change affect any open issues?',
            },
            issuesBody: {
                description:
                    'If issues are closed, the commit requires a body. Please enter a longer description of the commit itself',
            },
            issues: {
                description: 'Add issue references (e.g. "fix #123", "re #123".)',
            },
        },
    },
};
