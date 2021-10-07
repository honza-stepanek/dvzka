#!/usr/bin/perl

my $usage =
    "usage: ./gather-tags.pl TWINE_HTML [-l]\n" .
    "    prints all existing passage tags\n";


if (not defined $ARGV[0]) {
    print $usage;
    exit 1;
}

open(HTML, '<', $ARGV[0]) or die "couldn't open the file: $ARGV[0]";

my %tags;
while (<HTML>) {
    if ($_ =~ /<tw-passagedata [^>]* tags="([^"]*)"/) {
        for my $word (split(/\s+/, $1)) {
            $tags{$word} = 1;
        }
    }
}

for (keys %tags) {
    if ($ARGV[1] eq "-l") {
        print "$_\n";
    } else {
        print "$_, ";
    }
}


