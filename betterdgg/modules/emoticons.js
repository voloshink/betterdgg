;(function(bdgg) {
    bdgg.emoticons = (function() {
        var override;

        return {
            EMOTICONS: [ "ASLAN", "CallChad", "DJAslan", "FIDGETLOL",
                "CallCatz", "DESBRO", "Dravewin", "TooSpicy",
                "BrainSlug", "DansGame", "Kreygasm", "PJSalt", "PogChamp",
                "ResidentSleeper", "WinWaker", "ChanChamp", "RipPA",
                "OpieOP", "4Head", "DatSheffy", "GabeN", "SuccesS", "DankMeMe",
                "TopCake", "DSPstiny", "SephURR"
            ],

            OVERRIDES: [ "KINGSLY" ].sort(),

            init: function() {
                var emoticons = bdgg.emoticons.EMOTICONS
                    .filter(function(e) { return destiny.chat.gui.emoticons.indexOf(e) == -1 })
                    .sort();
                destiny.chat.gui.emoticons = destiny.chat.gui.emoticons.concat(emoticons).sort();
                $.each(emoticons, function(i, v) { destiny.chat.gui.autoCompletePlugin.addData(v, 2) });

                var bdggemoteregex = new RegExp('\\b('+emoticons.join('|')+')\\b', 'gm');
                var BDGGEmoteFormatter = {
                    format: function(str, user) {
                        // use jQuery to parse str as html and only replace in text nodes
                        var wrapped = $('<span>').append(str);
                        wrapped.find('span').addBack().contents().filter(function() { return this.nodeType == 3})
                            .replaceWith(function() {
                                return this.data
                                    .replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
                                    .replace(/</g, '&lt;').replace(/>/g, '&gt;')
                                    .replace(bdggemoteregex, '<div title="$1" class="chat-emote bdgg-chat-emote-$1"></div>');
                            });

                        if (override) {
                            wrapped.find('.chat-emote').addClass('bdgg-chat-emote-override');
                        }

                        return wrapped.html();
                    }
                };

                destiny.chat.gui.formatters.push(BDGGEmoteFormatter);

                // multi-emote
                $.each(destiny.chat.gui.formatters, function(i, f) {
                    if (f && f.hasOwnProperty('emoteregex') && f.hasOwnProperty('gemoteregex')) {
                        f.emoteregex = f.gemoteregex;
                        return false;
                    }
                });

                bdgg.emoticons.giveTabPriority(bdgg.settings.get('bdgg_emote_tab_priority'));
                bdgg.emoticons.overrideEmotes(bdgg.settings.get('bdgg_emote_override'));
                bdgg.settings.addObserver(function(key, value) {
                    if (key == 'bdgg_emote_tab_priority') {
                        bdgg.emoticons.giveTabPriority(value);
                    } else if (key == 'bdgg_emote_override') {
                        bdgg.emoticons.overrideEmotes(value);
                    }
                });

                // hook into emotes command
                var fnHandleCommand = destiny.chat.handleCommand;
                destiny.chat.handleCommand = function(str) {
                    fnHandleCommand.apply(this, arguments);
                    if (/^emotes ?/.test(str)) {
                        this.gui.push(new ChatInfoMessage("Better Destiny.gg: "+ emoticons.join(", ")));
                        if (override) {
                            this.gui.push(new ChatInfoMessage("Overrides: "+ bdgg.emoticons.OVERRIDES.join(", ")));
                        }
                    }
                };
            },
            giveTabPriority: function(value) {
                var weight = value ? Number.MAX_VALUE : 2;
                for (var i = 0; i < destiny.chat.gui.emoticons.length; i++) {
                    var emote = destiny.chat.gui.emoticons[i];
                    destiny.chat.gui.autoCompletePlugin.addData(emote, weight);
                }
            },
            overrideEmotes: function(value) {
                override = value;
            }
        }
    })();
}(window.BetterDGG = window.BetterDGG || {}));