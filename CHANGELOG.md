# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Close menu list on outside click
## [1.1.1] - 2021-03-15

### Changed
- Give a higher z-index to binding selector
### Fixed
- Fix bug on Admin side that was cleaning external URL when toggling on and off binding visibility.
## [1.1.0] - 2021-03-11

### Added
- Admin user can set an external URL to redirect user when selecting a specific binding.
### Fixed
- Redirect to the correct alternate hreflang for custom pages.

## [1.0.0] - 2021-03-03

### Changed
- App doesn't update `clientPreferencesData` when updating sales channel.
### Fixed
- Skip SSR for `getOrderForm` query since it has a private scope.

## [0.1.1] - 2021-02-26

## [0.1.0] - 2021-02-25

## [0.0.2] - 2021-02-25

### Added
- Add dropdown menu with available store bidings
