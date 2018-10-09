---
layout: post
title: Random String Generator
permalink: /problems/regex-gen.html
container: hca-layout
---

Write a string generator that takes a regular expression as argument and returns strings that match the given regular expression.

```javascript
generate(/[-+]?[0-9]{1,16}[.][0-9]{1,6}?/, 10)
```

should return results like
```javascript
"-1752643936.096896"
"9519688.31"
"+1.7036"
"+65048.3876"
"-6547028036936294.111"
"07252345.650"
"-27557.78"
"7385289878518.439775"
"13981103761187.90"
"4100273498885.614"
```
The generator should be able to support the following features.

`.` Match any character except newline<br/>
`[` Start character class definition<br/>
`]` End character class definition<br/>
`?` 0 or 1 quantifier<br/>
`*` 0 or more quantifiers<br/>
`+` 1 or more quantifier<br/>
`{` Start min/max quantifier<br/>
`}` End min/max quantifier<br/>

Within a character class, the following meta characters should be supported

`^` Negate the class, but only if the first character<br/>
`-` Indicates character range<br/>

## Bonus

The following features are optional.

`|` Start of alternative branch<br/>
`(` Start subpattern<br/>
`)` End subpattern<br/>
`\1`  back reference<br/>

Adding support for these features would make the generator able to handle complex patterns like

```javascript
generate(/(1[0-2]|0[1-9])(:[0-5][0-9]){2} (A|P)M/, 10)
```
```javascript
"10:43:51 PM"
"10:41:31 PM"
"03:09:55 PM"
"11:19:50 AM"
"11:20:41 PM"
"01:15:54 PM"
"02:10:04 AM"
"03:43:47 PM"
"09:39:03 AM"
"11:23:46 PM"
```
<br>
<br>
