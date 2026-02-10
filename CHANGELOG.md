# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- French translations

## [2.1.8] - 2026-02-04

### Fixed
- Updating README.

## [2.1.7] - 2024-04-25

## [2.1.6] - 2024-02-13

## [2.1.5] - 2023-08-31

### Fixed
- Portuguese, Spanish and Italian translations.

## [2.1.4] - 2023-06-28

### Fixed
- Messages standardization.

## [2.1.3] - 2023-01-30

### Fixed
- English translation

## [2.1.2] - 2022-02-17
### Added
- `dropdown` can now render flags

## [2.1.1] - 2022-01-31

### Fixed
- Italian, Portuguese and Spanish translations.

### Added
- Billing options
- Block interface `BindingChallenge`
- Block interface `CurrentBinding`
- 2 new types of selectors, a `select` and a `list`
- Flags to label bindings. It allows custom images or defaults to `defaultLocale` country code.
- User location detection.

## [1.5.0] - 2022-01-28

### Added
- Italian translation.

### Fixed
- Spanish translation.

## [1.4.1] - 2021-12-09
## [1.4.0] - 2021-10-05

### Changed
- Keep user in the same sales channel when selecting a new binding and the store has the flag `Update Sales Channel` off

## [1.3.3] - 2021-06-30

### Fixed
- Allow changing bindings from `my account` page.

## [1.3.2] - 2021-06-18

## [1.3.1] - 2021-05-27

### Fixed
- Issue keeping old information into configuration. It now updates `canonicalBaseAddress`, `salesChannel` and `defaultLocale` based on information coming from `tenant` app every time user saves new information inside `costumize store name`.

## [1.3.0] - 2021-05-26

### Added
- Allow user to hide labels for specific bindings in the drop down menu through the admin panel
- Add `active` class to css handles when dropdown is open.
## [1.2.1] - 2021-04-28

## [1.2.0] - 2021-03-30

### Added
- UX flow and warning to remember use to add translations for all active bindings
## [1.1.3] - 2021-03-24

## [1.1.2] - 2021-03-22

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
